import {
  plural as plural_,
  singular,
  camelCase,
  snakeCase,
  pascalCase,
} from '../../../helpers/string'
import {
  dataTypeNotSupported,
  dataTypeToSequelize,
  dataTypeToTypeScript,
  displaySequelizeDataType,
} from '../dataTypes'
import {
  Association,
  AssociationType,
  DataType,
  DataTypeType,
  Field,
  Model,
  Schema,
} from '../../../schema'
import { blank, lines } from '../../helpers'
import { DatabaseOptions, displaySqlDialect, SqlDialect } from '../../../database'

import { addIdField, hasJsonType, modelName } from '../utils'

// some association methods have singular and plural forms
// for example: "has many deer" would have addDeer for both adding one or multiple deer
// so we must append an 's' for nouns whose plural is the same as their singular
const plural = (v: string): string => {
  if (plural_(v) === singular(v)) return `${v}s`
  return plural_(v)
}

export { modelTemplate, ModelTemplateArgs }

type ModelTemplateArgs = {
  model: Model
  schema: Schema
  options: DatabaseOptions
}
type ModelAssociation = {
  model: Model
  association: Association
}

const modelTemplate = ({ model, schema, options }: ModelTemplateArgs): string => {
  const associations = joinModelAssociations({
    associations: model.associations,
    models: schema.models,
  })

  return modelTemplate_({ model, associations, options })
}

type JoinModelAssociationsArgs = {
  associations: Association[]
  models: Model[]
}
type ModelById = { [id: string]: Model }
const joinModelAssociations = ({
  associations,
  models,
}: JoinModelAssociationsArgs): ModelAssociation[] => {
  const modelById: ModelById = models.reduce<ModelById>((acc, model) => {
    acc[model.id] = model
    return acc
  }, {})

  return associations.map((association) => {
    return { association, model: modelById[association.targetModelId] }
  })
}

type ModelTemplateArgs_ = {
  model: Model
  associations: ModelAssociation[]
  options: DatabaseOptions
}
const modelTemplate_ = ({ model, associations, options }: ModelTemplateArgs_): string =>
  lines([
    imports({ model, associations, options }),
    blank(),
    types({ model, options }),
    blank(),
    classDeclaration({ model, associations, options }),
    blank(),
  ])

// Imports
type ImportsArgs = {
  model: Model
  associations: ModelAssociation[]
  options: DatabaseOptions
}
const imports = ({ model, associations, options }: ImportsArgs): string =>
  lines([
    sequelizeImports(),
    hasJsonType(model) ? importJsonType(options) : null,
    ...getAssociationTypes({ currentModel: model, associations }).map(typeImports),
  ])

const sequelizeImports = (): string =>
  `import Sequelize, { DataTypes, Model, Optional } from 'sequelize'`

type TypeImportArgs = [filename: string, types: string[]]

const importJsonType = ({ sqlDialect }: DatabaseOptions): Array<string | null> => {
  const json: DataType = { type: DataTypeType.Json }
  const comment = notSupportedComment(json, sqlDialect)
  return [noSupportedDetails(json, sqlDialect), `${comment}import { Json } from '../types'`]
}

const typeImports = ([filename, types]: TypeImportArgs): string =>
  `import type { ${types.join(', ')} } from './${filename}'`

type ModelAssociationTypes = { [modelName: string]: AssociationTypeLookup }
type AssociationTypeLookup = { [type: string]: boolean }

type GetAssociationTypes = {
  currentModel: Model
  associations: ModelAssociation[]
}
const getAssociationTypes = ({
  currentModel,
  associations,
}: GetAssociationTypes): Array<[filename: string, types: string[]]> => {
  // Get unique models for type imports
  const associationTypesByModel = associations.reduce<ModelAssociationTypes>(
    (acc, { model, association }) => {
      // Don't import types for current model
      if (association.targetModelId === currentModel.id) return acc

      const types = associationTypes({ association, model }).reduce<AssociationTypeLookup>(
        (acc, type) => {
          acc[type] = true
          return acc
        },
        acc[modelName(model)] || {},
      )

      acc[modelName(model)] = types

      return acc
    },
    {},
  )

  return (
    Object.entries(associationTypesByModel)
      // Sort model imports alphabetically
      .sort(([modelNameA], [modelNameB]) => modelNameA.localeCompare(modelNameB))
      .map(([modelName, types]) => [
        modelName,
        // Sort type imports alphabetically
        Object.keys(types).sort((a, b) => a.localeCompare(b)),
      ])
  )
}

const associationTypes = ({ model, association }: ModelAssociation): string[] =>
  [
    modelName(model),
    `${modelName(model)}Id`,
    association.type === AssociationType.HasOne ? `${modelName(model)}CreationAttributes` : null,
  ].filter((x): x is string => !!x)

// Types
type TypesArgs = {
  model: Model
  options: DatabaseOptions
}
const types = ({ model, options }: TypesArgs): string =>
  lines([
    modelAttributesType({ model, options }),
    blank(),
    idTypes(model),
    creationAttributeType(model),
  ])

const modelAttributesType = ({ model, options }: TypesArgs): string =>
  lines([
    `export interface ${modelName(model)}Attributes {`,
    lines(
      model.fields.map((field) => attributeType(field, options)),
      { depth: 2 },
    ),
    '}',
  ])

const attributeType = (
  { name, type, required }: Field,
  options: DatabaseOptions,
): Array<string | null> => {
  const comment = notSupportedComment(type, options.sqlDialect)
  const typeDisplay = dataTypeToTypeScript(type)

  return [
    noSupportedDetails(type, options.sqlDialect),
    `${comment}${camelCase(name)}${required ? '' : '?'}: ${typeDisplay}`,
  ]
}

const idTypes = (model: Model): string => {
  const name = modelName(model)
  const pks = model.fields.filter((f) => f.primaryKey)

  if (pks.length === 0) {
    return `export type ${name}Id = number`
  }

  return lines([
    `export type ${name}Pk = ${pks.map((f) => `'${camelCase(f.name)}'`).join(' | ')}`,
    `export type ${name}Id = ${name}Attributes[${name}Pk]`,
  ])
}

const creationAttributeType = (model: Model): string => {
  const name = modelName(model)
  const pks = model.fields.filter((f) => f.primaryKey)

  if (pks.length === 0) {
    return `export type ${name}CreationAttributes = ${name}Attributes & { id?: number }`
  }

  return `export type ${name}CreationAttributes = Optional<${name}Attributes, ${name}Pk>`
}

// Class
type ClassDeclarationArgs = {
  model: Model
  associations: ModelAssociation[]
  options: DatabaseOptions
}
const classDeclaration = ({ model, associations, options }: ClassDeclarationArgs): string => {
  const name = modelName(model)
  const fieldsWithId = addIdField(model.fields)

  return lines([
    `export class ${name} extends Model<${name}Attributes, ${name}CreationAttributes> implements ${name}Attributes {`,
    lines(
      fieldsWithId.map((field) => classFieldType(field, options)),
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
              model.fields.map((field) => fieldTemplate(field, options)),
              { depth: 2, separator: ',' },
            ),
            '}, {',
            lines(['sequelize', tableName({ model, options })], { depth: 2, separator: ',' }),
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
  options: DatabaseOptions,
): Array<string | null> => {
  const comment = notSupportedComment(type, options.sqlDialect)
  const readonly = primaryKey ? 'readonly ' : ''
  const optional = required ? '!' : '?'

  return [
    noSupportedDetails(type, options.sqlDialect),
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

  switch (association.type) {
    case AssociationType.BelongsTo:
      return [
        `// ${sourceName} belongsTo ${targetName}${aliasLabel(association)}`,
        `public readonly ${singularAssociationField}?: ${targetName}`,
        `public get${singularAssociationMethod}!: Sequelize.BelongsToGetAssociationMixin<${targetName}>`,
        `public set${singularAssociationMethod}!: Sequelize.BelongsToSetAssociationMixin<${targetName}, ${targetName}Id>`,
        `public create${singularAssociationMethod}!: Sequelize.BelongsToCreateAssociationMixin<${targetName}>`,
        blank(),
      ].join('\n')
    case AssociationType.HasMany:
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
    case AssociationType.HasOne:
      return [
        `// ${sourceName} hasOne ${targetName}${aliasLabel(association)}`,
        `public readonly ${singularAssociationField}?: ${targetName}`,
        `public get${singularAssociationMethod}!: Sequelize.HasOneGetAssociationMixin<${targetName}>`,
        `public set${singularAssociationMethod}!: Sequelize.HasOneSetAssociationMixin<${targetName}, ${targetName}Id>`,
        `public create${singularAssociationMethod}!: Sequelize.HasOneCreateAssociationMixin<${targetName}CreationAttributes>`,
        blank(),
      ].join('\n')
    case AssociationType.ManyToMany:
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
        primaryKey === undefined ? null : primaryKeyField(primaryKey),
        type.type === DataTypeType.Integer && type.autoincrement !== undefined
          ? autoincrementField(type.autoincrement)
          : null,
        required === undefined ? null : allowNullField(!required),
        unique === undefined ? null : uniqueField(unique),
      ],
      { depth: 2, separator: ',', prefix: comment },
    ),
    `${comment}}`,
  ])
}

const typeField = (dataType: DataType): string =>
  `type: ${displaySequelizeDataType(dataTypeToSequelize(dataType))}`
const allowNullField = (allowNull: boolean): string => `allowNull: ${allowNull}`
const primaryKeyField = (primaryKey: boolean): string => `primaryKey: ${primaryKey}`
const uniqueField = (unique: boolean): string => `unique: ${unique}`
const autoincrementField = (autoincrement: boolean) => `autoIncrement: ${autoincrement}`

type TableNameArgs = {
  model: Model
  options: DatabaseOptions
}
const tableName = ({ options: { caseStyle, nounForm }, model }: TableNameArgs): string | null => {
  if (nounForm === 'singular' && caseStyle === 'snake') {
    return `tableName: '${singular(snakeCase(model.name))}'`
  }
  return null
}

const notSupportedComment = (type: DataType, dialect: SqlDialect): string =>
  dataTypeNotSupported(type, dialect) ? '// ' : ''

const noSupportedDetails = (type: DataType, dialect: SqlDialect): string | null => {
  if (!dataTypeNotSupported(type, dialect)) return null

  const typeDisplay = displaySequelizeDataType(dataTypeToSequelize(type))
  return `//// ${typeDisplay} not supported for ${displaySqlDialect(dialect)}`
}
