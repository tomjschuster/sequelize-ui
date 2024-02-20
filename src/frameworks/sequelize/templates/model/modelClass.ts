import { blank, lines } from '@src/core/codegen'
import { DbCaseStyle, DbNounForm, DbOptions } from '@src/core/database'
import { Association, AssociationTypeType, Field, Model, integerDataType } from '@src/core/schema'
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
  const associationAliases = associations
    .map(({ association, model }) => `'${associationName({ association, targetModel: model })}'`)
    .join(' | ')

  const associationsType = associationAliases
    ? `type ${name}Associations = ${associationAliases}`
    : null

  const omit = associationAliases ? `, {omit: ${name}Associations}` : ''

  return lines([
    associationAliases ? associationsType : null,
    associationAliases ? blank() : null,
    `export class ${name} extends Model<`,
    lines([`InferAttributes<${name}${omit}>,`, `InferCreationAttributes<${name}${omit}>`], {
      depth: 2,
    }),
    `> {`,
    lines([...model.fields.map((field) => classFieldType(field, dbOptions, field.primaryKey))], {
      depth: 2,
    }),
    lines(
      getTimestampFields({ model, dbOptions }).map((field) =>
        classFieldType(field, dbOptions, true),
      ),
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
        `static initModel(sequelize: Sequelize): typeof ${name} {`,
        lines(
          [
            `${name}.init({`,
            lines(
              model.fields
                .concat(getTimestampFields({ model, dbOptions }))
                .map((field) => fieldTemplate({ field, dbOptions })),
              { depth: 2, separator: ',' },
            ),
            '}, {',
            lines(
              [
                'sequelize',
                tableName({ model, dbOptions }),
                model.softDelete ? 'paranoid: true' : null,
              ],
              {
                depth: 2,
                separator: ',',
              },
            ),
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
        `declare ${name}?: NonAttribute<${targetName}>`,
        `declare get${singularMethodPostfix}: BelongsToGetAssociationMixin<${targetName}>`,
        `declare set${singularMethodPostfix}: BelongsToSetAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare create${singularMethodPostfix}: BelongsToCreateAssociationMixin<${targetName}>`,
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
        `declare ${name}?: NonAttribute<${targetName}[]>`,
        `declare get${pluralMethodPostfix}: HasManyGetAssociationsMixin<${targetName}>`,
        `declare set${pluralMethodPostfix}: HasManySetAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare add${singularMethodPostfix}: HasManyAddAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare add${pluralMethodPostfix}: HasManyAddAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare create${singularMethodPostfix}: HasManyCreateAssociationMixin<${targetName}${createHasManyOmitFk}>`,
        `declare remove${singularMethodPostfix}: HasManyRemoveAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare remove${pluralMethodPostfix}: HasManyRemoveAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare has${singularMethodPostfix}: HasManyHasAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare has${pluralMethodPostfix}: HasManyHasAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare count${pluralMethodPostfix}: HasManyCountAssociationsMixin`,
        blank(),
      ].join('\n')
    }
    case AssociationTypeType.HasOne: {
      return [
        `// ${sourceName} hasOne ${targetName}${aliasLabel(association)}`,
        `declare ${name}?: NonAttribute<${targetName}>`,
        `declare get${singularMethodPostfix}: HasOneGetAssociationMixin<${targetName}>`,
        `declare set${singularMethodPostfix}: HasOneSetAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare create${singularMethodPostfix}: HasOneCreateAssociationMixin<${targetName}>`,
        blank(),
      ].join('\n')
    }
    case AssociationTypeType.ManyToMany: {
      return [
        `// ${sourceName} belongsToMany ${targetName}${aliasLabel(association)}`,
        `declare ${name}?: NonAttribute<${targetName}[]>`,
        `declare get${pluralMethodPostfix}: BelongsToManyGetAssociationsMixin<${targetName}>`,
        `declare set${pluralMethodPostfix}: BelongsToManySetAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare add${singularMethodPostfix}: BelongsToManyAddAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare add${pluralMethodPostfix}: BelongsToManyAddAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare create${singularMethodPostfix}: BelongsToManyCreateAssociationMixin<${targetName}>`,
        `declare remove${singularMethodPostfix}: BelongsToManyRemoveAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare remove${pluralMethodPostfix}: BelongsToManyRemoveAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare has${singularMethodPostfix}: BelongsToManyHasAssociationMixin<${targetName}, ${targetPkType}>`,
        `declare has${pluralMethodPostfix}: BelongsToManyHasAssociationsMixin<${targetName}, ${targetPkType}>`,
        `declare count${pluralMethodPostfix}: BelongsToManyCountAssociationsMixin`,
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
