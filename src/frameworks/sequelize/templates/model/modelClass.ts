import { blank, lines } from '@src/core/codegen'
import { DbCaseStyle, DbNounForm, DbOptions } from '@src/core/database'
import { Association, AssociationTypeType, Field, integerDataType, Model } from '@src/core/schema'
import { camelCase, pascalCase, plural, singular, snakeCase } from '@src/utils/string'
import { associationName } from '../../utils/associations'
import {
  dataTypeToTypeScript,
  noSupportedDetails,
  notSupportedComment,
} from '../../utils/dataTypes'
import { fieldTemplate, getTimestampFields } from '../../utils/field'
import { ModelAssociation, modelName } from '../../utils/model'

export type ModelClassTempalteArgs = {
  model: Model
  associations: ModelAssociation[]
  dbOptions: DbOptions
}
export function modelClassTemplate({
  model,
  associations,
  dbOptions,
}: ModelClassTempalteArgs): string {
  const name = modelName(model)

  return lines([
    `export class ${name} extends  Model<InferAttributes<${name}>, InferCreationAttributes<${name}>> {`,
    lines([...model.fields.map((field) => classFieldType(field, dbOptions, field.primaryKey))], {
      depth: 2,
    }),
    lines(
      getTimestampFields({ dbOptions }).map((field) => classFieldType(field, dbOptions, true)),
      { depth: 2 },
    ),
    associations.length ? blank() : null,
    lines(
      associations.map((a) => associationType({ sourceModel: model, association: a })),
      { depth: 2 },
    ),
    associations.length
      ? lines(
          [
            'declare static associations: {',
            lines(
              associations.map((association) =>
                staticAssociation({ sourceModel: model, association }),
              ),
              { depth: 2, separator: ',' },
            ),
            '}',
          ],
          {
            depth: 2,
          },
        )
      : null,
    associations.length ? blank() : null,
    lines(
      [
        `static initModel(sequelize: Sequelize.Sequelize): typeof ${name} {`,
        lines(
          [
            `${name}.init({`,
            lines(
              model.fields
                .concat(getTimestampFields({ dbOptions }))
                .map((field) => fieldTemplate({ field, dbOptions })),
              { depth: 2, separator: ',' },
            ),
            '}, {',
            lines(['sequelize', tableName({ model, dbOptions })], {
              depth: 2,
              separator: ',',
            }),
            '})',
            blank(),
            `return ${name}`,
          ],
          { depth: 2 },
        ),
        '}',
      ],
      { depth: 2 },
    ),

    '}',
  ])
}

const classFieldType = (
  { name, type, required }: Field,
  dbOptions: DbOptions,
  creationOptional: boolean,
): Array<string | null> => {
  const comment = notSupportedComment(type, dbOptions.sqlDialect)
  const tsType = dataTypeToTypeScript(type)

  const fieldType = creationOptional
    ? `CreationOptional<${tsType}>`
    : required
    ? tsType
    : `${tsType} | null`

  return [
    noSupportedDetails(type, dbOptions.sqlDialect),
    `${comment}declare ${camelCase(name)}: ${fieldType}`,
  ]
}

type StaticAssociation = {
  sourceModel: Model
  association: ModelAssociation
}
function staticAssociation({
  sourceModel,
  association: { model: targetModel, association },
}: StaticAssociation): string {
  const key = associationName({ association, targetModel })
  const value = `Association<${modelName(sourceModel)}, ${modelName(targetModel)}>`
  return `${key}: ${value}`
}

type AssociationTypeArgs = {
  sourceModel: Model
  association: ModelAssociation
}
function associationType({
  sourceModel,
  association: { model: targetModel, association },
}: AssociationTypeArgs): string {
  const sourceName = modelName(sourceModel)
  const targetName = modelName(targetModel)
  const name = associationName({ association, targetModel })
  const singularMethodPostfix = singular(pascalCase(name))
  const pluralMethodPostfix = plural(pascalCase(name))
  const targetPks = targetModel.fields.filter((f) => f.primaryKey)
  const targetPkType =
    targetPks.length > 1
      ? 'never'
      : targetPks.length === 1
      ? dataTypeToTypeScript(targetPks[0].type)
      : dataTypeToTypeScript(integerDataType())

  switch (association.type.type) {
    case AssociationTypeType.BelongsTo: {
      return [
        `// ${sourceName} belongsTo ${targetName}${aliasLabel(association)}`,
        `declare ${name}: NonAttribute<${targetName}>`,
        `declare get${singularMethodPostfix}: Sequelize.BelongsToGetAssociationMixin<${targetName}>`,
        `declare set${singularMethodPostfix}: Sequelize.BelongsToSetAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare create${singularMethodPostfix}: Sequelize.BelongsToCreateAssociationMixin<${targetName}>`,
        blank(),
      ].join('\n')
    }
    case AssociationTypeType.HasMany: {
      const fk =
        association.foreignKey ||
        singular(camelCase(associationName({ association, targetModel: sourceModel }))) + 'Id'

      const createHasManyOmitFk = targetModel.fields.some((field) => camelCase(field.name) === fk)
        ? `, '${fk}'`
        : ''

      return [
        `// ${sourceName} hasMany ${targetName}${aliasLabel(association)}`,
        `declare ${name}: NonAttribute<${targetName}[]>`,
        `declare get${pluralMethodPostfix}: Sequelize.HasManyGetAssociationsMixin<${targetName}>`,
        `declare set${pluralMethodPostfix}: Sequelize.HasManySetAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare add${singularMethodPostfix}: Sequelize.HasManyAddAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare add${pluralMethodPostfix}: Sequelize.HasManyAddAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare create${singularMethodPostfix}: Sequelize.HasManyCreateAssociationMixin<${targetName}${createHasManyOmitFk}>`,
        `declare remove${singularMethodPostfix}: Sequelize.HasManyRemoveAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare remove${pluralMethodPostfix}: Sequelize.HasManyRemoveAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare has${singularMethodPostfix}: Sequelize.HasManyHasAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare has${pluralMethodPostfix}: Sequelize.HasManyHasAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare count${pluralMethodPostfix}: Sequelize.HasManyCountAssociationsMixin`,
        blank(),
      ].join('\n')
    }
    case AssociationTypeType.HasOne: {
      return [
        `// ${sourceName} hasOne ${targetName}${aliasLabel(association)}`,
        `declare ${name}: NonAttribute<${targetName}>`,
        `declare get${singularMethodPostfix}: Sequelize.HasOneGetAssociationMixin<${targetName}>`,
        `declare set${singularMethodPostfix}: Sequelize.HasOneSetAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare create${singularMethodPostfix}: Sequelize.HasOneCreateAssociationMixin<${targetName}>`,
        blank(),
      ].join('\n')
    }
    case AssociationTypeType.ManyToMany: {
      return [
        `// ${sourceName} belongsToMany ${targetName}${aliasLabel(association)}`,
        `declare ${name}: NonAttribute<${targetName}[]>`,
        `declare get${pluralMethodPostfix}: Sequelize.BelongsToManyGetAssociationsMixin<${targetName}>`,
        `declare set${pluralMethodPostfix}: Sequelize.BelongsToManySetAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare add${singularMethodPostfix}: Sequelize.BelongsToManyAddAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare add${pluralMethodPostfix}: Sequelize.BelongsToManyAddAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare create${singularMethodPostfix}: Sequelize.BelongsToManyCreateAssociationMixin<${targetName}>`,
        `declare remove${singularMethodPostfix}: Sequelize.BelongsToManyRemoveAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare remove${pluralMethodPostfix}: Sequelize.BelongsToManyRemoveAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare has${singularMethodPostfix}: Sequelize.BelongsToManyHasAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare has${pluralMethodPostfix}: Sequelize.BelongsToManyHasAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare count${pluralMethodPostfix}: Sequelize.BelongsToManyCountAssociationsMixin`,
        blank(),
      ].join('\n')
    }
  }
}

function aliasLabel({ alias }: Association): string {
  return alias ? ` (as ${pascalCase(alias)})` : ''
}

type TableNameArgs = {
  model: Model
  dbOptions: DbOptions
}
function tableName({ dbOptions: { caseStyle, nounForm }, model }: TableNameArgs): string | null {
  if (nounForm === DbNounForm.Singular && caseStyle === DbCaseStyle.Snake) {
    return `tableName: '${singular(snakeCase(model.name))}'`
  }
  return null
}
