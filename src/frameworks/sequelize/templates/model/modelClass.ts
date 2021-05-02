import { blank, lines } from '@src/core/codegen'
import { DbCaseStyle, DbNounForm, DbOptions } from '@src/core/database'
import {
  Association,
  AssociationTypeType,
  DataType,
  DataTypeType,
  Field,
  Model,
} from '@src/core/schema'
import { camelCase, pascalCase, plural, singular, snakeCase } from '@src/utils/string'
import {
  dataTypeToTypeScript,
  displaySequelizeDataType,
  sequelizeUuidVersion,
} from '../../dataTypes'
import { modelName, pkIsDefault } from '../../helpers'
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
    lines(
      [
        `static initModel(sequelize: Sequelize.Sequelize): typeof ${name} {`,
        lines(
          [
            `${name}.init({`,
            lines(
              model.fields
                .filter((field) => !pkIsDefault(field))
                .map((field) => fieldTemplate(field, dbOptions)),
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
  const associationName = association.alias || targetName
  const singularAssociationField = singular(camelCase(associationName))
  const pluralAssociationField = plural(camelCase(associationName))
  const singularAssociationMethod = singular(pascalCase(associationName))
  const pluralAssociationMethod = plural(pascalCase(associationName))

  switch (association.type.type) {
    case AssociationTypeType.BelongsTo:
      return [
        `// ${sourceName} belongsTo ${targetName}${aliasLabel(association)}`,
        `public readonly ${singularAssociationField}?: ${targetName}`,
        `public get${singularAssociationMethod}!: Sequelize.BelongsToGetAssociationMixin<${targetName}>`,
        `public set${singularAssociationMethod}!: Sequelize.BelongsToSetAssociationMixin<${targetName}, ${targetName}Id>`,
        `public create${singularAssociationMethod}!: Sequelize.BelongsToCreateAssociationMixin<${targetName}>`,
        blank(),
      ].join('\n')
    case AssociationTypeType.HasMany:
      return [
        `// ${sourceName} hasMany ${targetName}${aliasLabel(association)}`,
        `public readonly ${pluralAssociationField}?: ${targetName}[]`,
        `public get${pluralAssociationMethod}!: Sequelize.HasManyGetAssociationsMixin<${targetName}>`,
        `public set${pluralAssociationMethod}!: Sequelize.HasManySetAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public add${singularAssociationMethod}!: Sequelize.HasManyAddAssociationMixin<${targetName}, ${targetName}Id>`,
        `public add${pluralAssociationMethod}!: Sequelize.HasManyAddAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public create${singularAssociationMethod}!: Sequelize.HasManyCreateAssociationMixin<${targetName}>`,
        `public remove${singularAssociationMethod}!: Sequelize.HasManyRemoveAssociationMixin<${targetName}, ${targetName}Id>`,
        `public remove${pluralAssociationMethod}!: Sequelize.HasManyRemoveAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public has${singularAssociationMethod}!: Sequelize.HasManyHasAssociationMixin<${targetName}, ${targetName}Id>`,
        `public has${pluralAssociationMethod}!: Sequelize.HasManyHasAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public count${pluralAssociationMethod}!: Sequelize.HasManyCountAssociationsMixin`,
        blank(),
      ].join('\n')
    case AssociationTypeType.HasOne:
      return [
        `// ${sourceName} hasOne ${targetName}${aliasLabel(association)}`,
        `public readonly ${singularAssociationField}?: ${targetName}`,
        `public get${singularAssociationMethod}!: Sequelize.HasOneGetAssociationMixin<${targetName}>`,
        `public set${singularAssociationMethod}!: Sequelize.HasOneSetAssociationMixin<${targetName}, ${targetName}Id>`,
        `public create${singularAssociationMethod}!: Sequelize.HasOneCreateAssociationMixin<${targetName}CreationAttributes>`,
        blank(),
      ].join('\n')
    case AssociationTypeType.ManyToMany:
      return [
        `// ${sourceName} belongsToMany ${targetName}${aliasLabel(association)}`,
        `public readonly ${pluralAssociationField}?: ${targetName}[]`,
        `public get${pluralAssociationMethod}!: Sequelize.BelongsToManyGetAssociationsMixin<${targetName}>`,
        `public set${pluralAssociationMethod}!: Sequelize.BelongsToManySetAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public add${singularAssociationMethod}!: Sequelize.BelongsToManyAddAssociationMixin<${targetName}, ${targetName}Id>`,
        `public add${pluralAssociationMethod}!: Sequelize.BelongsToManyAddAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public create${singularAssociationMethod}!: Sequelize.BelongsToManyCreateAssociationMixin<${targetName}>`,
        `public remove${singularAssociationMethod}!: Sequelize.BelongsToManyRemoveAssociationMixin<${targetName}, ${targetName}Id>`,
        `public remove${pluralAssociationMethod}!: Sequelize.BelongsToManyRemoveAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public has${singularAssociationMethod}!: Sequelize.BelongsToManyHasAssociationMixin<${targetName}, ${targetName}Id>`,
        `public has${pluralAssociationMethod}!: Sequelize.BelongsToManyHasAssociationsMixin<${targetName}, ${targetName}Id>`,
        `public count${pluralAssociationMethod}!: Sequelize.BelongsToManyCountAssociationsMixin`,
        blank(),
      ].join('\n')
  }
}

function aliasLabel({ alias }: Association): string {
  return alias ? ` (as ${pascalCase(alias)})` : ''
}

function fieldTemplate(
  { name, type, required, primaryKey, unique }: Field,
  { sqlDialect }: DbOptions,
): string {
  const comment = notSupportedComment(type, sqlDialect)

  return lines([
    noSupportedDetails(type, sqlDialect),
    `${comment}${camelCase(name)}: {`,
    lines(
      [
        typeField(type),
        primaryKeyField(primaryKey),
        autoincrementField(type),
        allowNullField(required),
        uniqueField(unique),
        defaultField(type),
      ],
      { depth: 2, separator: ',', prefix: comment },
    ),
    `${comment}}`,
  ])
}

function typeField(dataType: DataType): string {
  return `type: ${displaySequelizeDataType(dataType)}`
}

function allowNullField(required?: boolean): string | null {
  return required === undefined ? null : `allowNull: ${!required}`
}

function primaryKeyField(primaryKey?: boolean): string | null {
  return primaryKey ? `primaryKey: ${primaryKey}` : null
}

function uniqueField(unique?: boolean): string | null {
  return unique === undefined ? null : `unique: ${unique}`
}

function autoincrementField(dataType: DataType): string | null {
  return dataType.type === DataTypeType.Integer && dataType.autoincrement !== undefined
    ? `autoIncrement: ${dataType.autoincrement}`
    : null
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

function defaultField(dataType: DataType) {
  if (dataType.type === DataTypeType.DateTime && dataType.defaultNow) {
    return `defaultValue: DataTypes.NOW`
  }

  if (dataType.type === DataTypeType.Date && dataType.defaultNow) {
    return `defaultValue: DataTypes.NOW`
  }

  if (dataType.type === DataTypeType.Time && dataType.defaultNow) {
    return `defaultValue: DataTypes.NOW`
  }

  if (dataType.type === DataTypeType.Uuid && dataType.defaultVersion) {
    return `defaultValue: ${sequelizeUuidVersion(dataType.defaultVersion)}`
  }

  return null
}
