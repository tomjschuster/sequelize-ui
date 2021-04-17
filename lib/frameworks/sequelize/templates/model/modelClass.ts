import {
  Association,
  AssociationTypeType,
  blank,
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  DataType,
  DataTypeType,
  Field,
  lines,
  Model,
  sqlCurrentDate,
  sqlCurrentTime,
  sqlCurrentTimestamp,
} from '@lib/core'
import { camelCase, pascalCase, singular, snakeCase } from '@lib/utils'
import {
  dataTypeToSequelize,
  dataTypeToTypeScript,
  displaySequelizeDataType,
  sequelizeUuidVersion,
} from '../../dataTypes'
import { addIdField, literalFunction, modelName, plural } from '../../helpers'
import { ModelAssociation, noSupportedDetails, notSupportedComment } from './common'

export type ModelClassTempalteArgs = {
  model: Model
  associations: ModelAssociation[]
  dbOptions: DatabaseOptions
}
export const modelClassTemplate = ({
  model,
  associations,
  dbOptions,
}: ModelClassTempalteArgs): string => {
  const name = modelName(model)
  const fieldsWithId = addIdField(model.fields)

  return lines([
    `export class ${name} extends Model<${name}Attributes, ${name}CreationAttributes> implements ${name}Attributes {`,
    lines(
      fieldsWithId.map((field) => classFieldType(field, dbOptions)),
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
              model.fields.map((field) => fieldTemplate(field, dbOptions)),
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
  dbOptions: DatabaseOptions,
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
const associationType = ({
  sourceModel,
  association: { model: targetModel, association },
}: AssociationTypeArgs): string => {
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

const aliasLabel = ({ alias }: Association): string => (alias ? ` (as ${pascalCase(alias)})` : '')

const fieldTemplate = (
  { name, type, required, primaryKey, unique }: Field,
  { sqlDialect }: DatabaseOptions,
): string => {
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

const typeField = (dataType: DataType): string =>
  `type: ${displaySequelizeDataType(dataTypeToSequelize(dataType))}`

const allowNullField = (required?: boolean): string | null =>
  required === undefined ? null : `allowNull: ${!required}`

const primaryKeyField = (primaryKey?: boolean): string | null =>
  primaryKey ? `primaryKey: ${primaryKey}` : null

const uniqueField = (unique?: boolean): string | null =>
  unique === undefined ? null : `unique: ${unique}`

const autoincrementField = (dataType: DataType) =>
  dataType.type === DataTypeType.Integer && dataType.autoincrement !== undefined
    ? `autoIncrement: ${dataType.autoincrement}`
    : null

type TableNameArgs = {
  model: Model
  dbOptions: DatabaseOptions
}
const tableName = ({ dbOptions: { caseStyle, nounForm }, model }: TableNameArgs): string | null => {
  if (nounForm === DatabaseNounForm.Singular && caseStyle === DatabaseCaseStyle.Snake) {
    return `tableName: '${singular(snakeCase(model.name))}'`
  }
  return null
}

const defaultField = (dataType: DataType) => {
  if (dataType.type === DataTypeType.DateTime && dataType.defaultNow) {
    return `defaultValue: ${literalFunction(sqlCurrentTimestamp())}`
  }

  if (dataType.type === DataTypeType.Date && dataType.defaultNow) {
    return `defaultValue: ${literalFunction(sqlCurrentDate())}`
  }

  if (dataType.type === DataTypeType.Time && dataType.defaultNow) {
    return `defaultValue: ${literalFunction(sqlCurrentTime())}`
  }

  if (dataType.type === DataTypeType.Uuid && dataType.defaultVersion) {
    return `defaultValue: ${sequelizeUuidVersion(dataType.defaultVersion)}`
  }

  return null
}
