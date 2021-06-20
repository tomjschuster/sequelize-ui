import { blank, lines } from '@src/core/codegen'
import { DbCaseStyle, DbNounForm, DbOptions } from '@src/core/database'
import { Association, AssociationTypeType, Field, Model } from '@src/core/schema'
import { camelCase, pascalCase, plural, singular, snakeCase } from '@src/utils/string'
import { associationName } from '../../utils/associations'
import { dataTypeToTypeScript } from '../../utils/dataTypes'
import { fieldTemplate } from '../../utils/field'
import { pkIsDefault } from '../../utils/helpers'
import { modelName } from '../../utils/model'
import { ModelAssociation, noSupportedDetails, notSupportedComment } from './common'

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
    `export class ${name} extends Model<${name}Attributes, ${name}CreationAttributes> implements ${name}Attributes {`,
    lines(
      model.fields.map((field) => classFieldType(field, dbOptions)),
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
            'public static associations: {',
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
                .filter((field) => !pkIsDefault(field))
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
  { name, type, required, primaryKey }: Field,
  dbOptions: DbOptions,
): Array<string | null> => {
  const comment = notSupportedComment(type, dbOptions.sqlDialect)
  const readonly = primaryKey ? 'readonly ' : ''
  const optional = required ? '!' : '?'

  return [
    noSupportedDetails(type, dbOptions.sqlDialect),
    `${comment}public ${readonly}${camelCase(name)}${optional}: ${dataTypeToTypeScript(type)}`,
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

  switch (association.type.type) {
    case AssociationTypeType.BelongsTo:
      return [
        `// ${sourceName} belongsTo ${targetName}${aliasLabel(association)}`,
        `public readonly ${name}?: ${targetName}`,
        `public get${singularMethodPostfix}!: Sequelize.BelongsToGetAssociationMixin<${targetName}>`,
        `public set${singularMethodPostfix}!: Sequelize.BelongsToSetAssociationMixin<${targetName}, ${targetName}Id>`,
        `public create${singularMethodPostfix}!: Sequelize.BelongsToCreateAssociationMixin<${targetName}>`,
        blank(),
      ].join('\n')
    case AssociationTypeType.HasMany:
      return [
        `// ${sourceName} hasMany ${targetName}${aliasLabel(association)}`,
        `public readonly ${name}?: ${targetName}[]`,
        `public get${pluralMethodPostfix}!: Sequelize.HasManyGetAssociationsMixin<${targetName}>`,
        `public set${pluralMethodPostfix}!: Sequelize.HasManySetAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public add${singularMethodPostfix}!: Sequelize.HasManyAddAssociationMixin<${targetName}, ${targetName}Id>`,
        `public add${pluralMethodPostfix}!: Sequelize.HasManyAddAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public create${singularMethodPostfix}!: Sequelize.HasManyCreateAssociationMixin<${targetName}>`,
        `public remove${singularMethodPostfix}!: Sequelize.HasManyRemoveAssociationMixin<${targetName}, ${targetName}Id>`,
        `public remove${pluralMethodPostfix}!: Sequelize.HasManyRemoveAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public has${singularMethodPostfix}!: Sequelize.HasManyHasAssociationMixin<${targetName}, ${targetName}Id>`,
        `public has${pluralMethodPostfix}!: Sequelize.HasManyHasAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public count${pluralMethodPostfix}!: Sequelize.HasManyCountAssociationsMixin`,
        blank(),
      ].join('\n')
    case AssociationTypeType.HasOne:
      return [
        `// ${sourceName} hasOne ${targetName}${aliasLabel(association)}`,
        `public readonly ${name}?: ${targetName}`,
        `public get${singularMethodPostfix}!: Sequelize.HasOneGetAssociationMixin<${targetName}>`,
        `public set${singularMethodPostfix}!: Sequelize.HasOneSetAssociationMixin<${targetName}, ${targetName}Id>`,
        `public create${singularMethodPostfix}!: Sequelize.HasOneCreateAssociationMixin<${targetName}CreationAttributes>`,
        blank(),
      ].join('\n')
    case AssociationTypeType.ManyToMany:
      return [
        `// ${sourceName} belongsToMany ${targetName}${aliasLabel(association)}`,
        `public readonly ${name}?: ${targetName}[]`,
        `public get${pluralMethodPostfix}!: Sequelize.BelongsToManyGetAssociationsMixin<${targetName}>`,
        `public set${pluralMethodPostfix}!: Sequelize.BelongsToManySetAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public add${singularMethodPostfix}!: Sequelize.BelongsToManyAddAssociationMixin<${targetName}, ${targetName}Id>`,
        `public add${pluralMethodPostfix}!: Sequelize.BelongsToManyAddAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public create${singularMethodPostfix}!: Sequelize.BelongsToManyCreateAssociationMixin<${targetName}>`,
        `public remove${singularMethodPostfix}!: Sequelize.BelongsToManyRemoveAssociationMixin<${targetName}, ${targetName}Id>`,
        `public remove${pluralMethodPostfix}!: Sequelize.BelongsToManyRemoveAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public has${singularMethodPostfix}!: Sequelize.BelongsToManyHasAssociationMixin<${targetName}, ${targetName}Id>`,
        `public has${pluralMethodPostfix}!: Sequelize.BelongsToManyHasAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public count${pluralMethodPostfix}!: Sequelize.BelongsToManyCountAssociationsMixin`,
        blank(),
      ].join('\n')
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
