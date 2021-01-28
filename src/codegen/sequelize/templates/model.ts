import {
  plural as plural_,
  singular,
  camelCase,
  snakeCase,
  pascalCase,
} from '../../../helpers/string'
import { dataTypeToSequelize, dataTypeToTypeScript, displaySequelizeDataType } from '../dataTypes'
import {
  Association,
  AssociationType,
  DataType,
  DataTypeType,
  Field,
  Model,
  Schema,
  SchemaOptions,
} from '../../../schema'
import { indent, blank } from '../../helpers'

// some association methods have singular and plural forms
// for example: "has many deer" would have addDeer for both adding one or multiple der
// so we must append an 's' for nouns whose plural is the same as their singular
const plural = (v: string): string => {
  if (plural_(v) === singular(v)) return `${v}s`
  return plural_(v)
}

export { modelTemplate, ModelTemplateArgs }

type ModelTemplateArgs = {
  model: Model
  schema: Schema
  options: SchemaOptions
}
type ModelAssociation = { model: Model; association: Association }

const modelTemplate = ({ model, schema, options }: ModelTemplateArgs): string => {
  const associations = joinModelAssociations({
    associations: model.associations,
    models: schema.models,
  })

  return modelTemplate_({ model, associations, options })
}

type JoinModelAssociationsArgs = { associations: Association[]; models: Model[] }
const joinModelAssociations = ({
  associations,
  models,
}: JoinModelAssociationsArgs): ModelAssociation[] =>
  associations
    .map((association) => {
      const targetModel = models.find(({ id }) => id === association.targetModelId)
      // model should always exist, will filter out nulls below for proper typing
      if (!targetModel) return null

      return { association, model: targetModel }
    })
    .filter((ma): ma is ModelAssociation => !!ma)

type ModelTemplateArgs_ = {
  model: Model
  associations: ModelAssociation[]
  options: SchemaOptions
}
const modelTemplate_ = ({ model, associations, options }: ModelTemplateArgs_): string =>
  [
    imports({ model, associations }),
    blank(),
    types({ modelName: model.name, fields: model.fields }),
    blank(),
    classDeclaration({ modelName: model.name, fields: model.fields, associations, options }),
  ].join('\n')

// Imports
type ImportsArgs = {
  model: Model
  associations: ModelAssociation[]
}
const imports = ({ model, associations }: ImportsArgs): string =>
  [
    sequelizeImports(),
    ...getAssociationTypes({ currentModel: model, associations }).map(([filename, types]) =>
      typeImports({ filename, types }),
    ),
  ].join('\n')

const sequelizeImports = (): string =>
  `import Sequelize, { DataTypes, Model, Optional } from 'sequelize';`

type TypeImportArgs = {
  filename: string
  types: string[]
}
const typeImports = ({ filename, types }: TypeImportArgs): string =>
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
        acc[singular(pascalCase(model.name))] || {},
      )

      acc[singular(pascalCase(model.name))] = types

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
    singular(pascalCase(model.name)),
    `${singular(pascalCase(model.name))}Id`,
    association.type === AssociationType.HasOne
      ? `${singular(pascalCase(model.name))}CreationAttributes`
      : null,
  ].filter((x): x is string => !!x)

// Types
type TypesArgs = {
  modelName: string
  fields: Field[]
}
const types = ({ modelName, fields }: TypesArgs): string =>
  [
    modelAttributesType({ modelName, fields }),
    blank(),
    idTypes({ modelName, fields }),
    creationAttributeType(modelName),
  ].join('\n')

type ModelAttributesTypeArgs = {
  modelName: string
  fields: Field[]
}
const modelAttributesType = ({ modelName, fields }: ModelAttributesTypeArgs): string =>
  `export interface ${pascalCase(modelName)}Attributes {
  ${indent(2, fields.map(attributeType).join('\n'))}
}`

const attributeType = ({ name, type, required }: Field): string =>
  `${camelCase(name)}${required ? '?' : ''}: ${dataTypeToTypeScript(type)};`

type IdTypesArgs = {
  modelName: string
  fields: Field[]
}
const idTypes = ({ modelName, fields }: IdTypesArgs): string =>
  `export type ${pascalCase(modelName)}Pk = ${fields
    .filter((f) => f.primaryKey)
    .map((f) => `'${camelCase(f.name)}'`)
    .join(' | ')}
export type ${pascalCase(modelName)}Id = ${pascalCase(modelName)}Attributes[${pascalCase(
    modelName,
  )}Pk]`

const creationAttributeType = (modelName: string): string =>
  `export type ${pascalCase(modelName)}CreationAttributes = Optional<${pascalCase(
    modelName,
  )}Attributes, ${pascalCase(modelName)}Pk>;`

// Class
type ClassDeclarationArgs = {
  modelName: string
  fields: Field[]
  associations: ModelAssociation[]
  options: SchemaOptions
}
const classDeclaration = ({
  modelName,
  fields,
  associations,
  options,
}: ClassDeclarationArgs): string =>
  `export class ${pascalCase(modelName)} extends Model<${pascalCase(
    modelName,
  )}Attributes, ${pascalCase(modelName)}CreationAttributes> implements ${pascalCase(
    modelName,
  )}Attributes {
  ${indent(2, fields.map(classFieldType).join('\n'))}${associations.length ? '\n' : ''}
  ${indent(2, associations.map((a) => associationType({ modelName, association: a })).join('\n'))}
  static initModel(sequelize: Sequelize.Sequelize): typeof ${pascalCase(modelName)} {
    ${pascalCase(modelName)}.init({
    ${indent(4, fields.map(fieldTemplate).join(',\n'))}
    }, {
      ${indent(6, modelOptions({ modelName, options }))}
    });

    return ${pascalCase(modelName)};
  }
}`

const classFieldType = ({ name, type, required, primaryKey }: Field): string =>
  `public ${primaryKey ? 'readonly ' : ''}${camelCase(name)}${
    required ? '?' : '!'
  }: ${dataTypeToTypeScript(type)};`

type AssociationTypeArgs = {
  modelName: string
  association: ModelAssociation
}
const associationType = ({
  modelName: baseName,
  association: {
    model: { name: targetName },
    association,
  },
}: AssociationTypeArgs): string => {
  const baseType = singular(pascalCase(baseName))
  const targetType = singular(pascalCase(targetName))
  const associationName = association.alias || targetName
  const singularAssociationField = singular(camelCase(associationName))
  const pluralAssociationField = plural(camelCase(associationName))
  const singularAssociationMethod = singular(pascalCase(associationName))
  const pluralAssociationMethod = plural(pascalCase(associationName))

  switch (association.type) {
    case AssociationType.BelongsTo:
      return [
        `// ${baseType} belongsTo ${targetType}${aliasLabel(association)}`,
        `public readonly ${singularAssociationField}?: ${targetType};`,
        `public get${singularAssociationMethod}!: Sequelize.BelongsToGetAssociationMixin<${targetType}>;`,
        `public set${singularAssociationMethod}!: Sequelize.BelongsToSetAssociationMixin<${targetType}, ${targetType}Id>;`,
        `public create${singularAssociationMethod}!: Sequelize.BelongsToCreateAssociationMixin<${targetType}>;`,
        blank(),
      ].join('\n')
    case AssociationType.HasMany:
      return [
        `// ${baseType} hasMany ${targetType}${aliasLabel(association)}`,
        `public readonly ${pluralAssociationField}?: ${targetType}[];`,
        `public get${pluralAssociationMethod}!: Sequelize.HasManyGetAssociationsMixin<${targetType}>;`,
        `public set${pluralAssociationMethod}!: Sequelize.HasManySetAssociationsMixin<${targetType}, ${targetType}Id>;`,
        `public add${singularAssociationMethod}!: Sequelize.HasManyAddAssociationMixin<${targetType}, ${targetType}Id>;`,
        `public add${pluralAssociationMethod}!: Sequelize.HasManyAddAssociationsMixin<${targetType}, ${targetType}Id>;`,
        `public create${singularAssociationMethod}!: Sequelize.HasManyCreateAssociationMixin<${targetType}>;`,
        `public remove${singularAssociationMethod}!: Sequelize.HasManyRemoveAssociationMixin<${targetType}, ${targetType}Id>;`,
        `public remove${pluralAssociationMethod}!: Sequelize.HasManyRemoveAssociationsMixin<${targetType}, ${targetType}Id>;`,
        `public has${singularAssociationMethod}!: Sequelize.HasManyHasAssociationMixin<${targetType}, ${targetType}Id>;`,
        `public has${pluralAssociationMethod}!: Sequelize.HasManyHasAssociationsMixin<${targetType}, ${targetType}Id>;`,
        `public count${pluralAssociationMethod}!: Sequelize.HasManyCountAssociationsMixin;`,
        blank(),
      ].join('\n')
    case AssociationType.HasOne:
      return [
        `// ${baseType} hasOne ${targetType}${aliasLabel(association)}`,
        `public readonly ${singularAssociationField}?: ${targetType};`,
        `public get${singularAssociationMethod}!: Sequelize.HasOneGetAssociationMixin<${targetType}>;`,
        `public set${singularAssociationMethod}!: Sequelize.HasOneSetAssociationMixin<${targetType}, ${targetType}Id>;`,
        `public create${singularAssociationMethod}!: Sequelize.HasOneCreateAssociationMixin<${targetType}CreationAttributes>;`,
        blank(),
      ].join('\n')
    case AssociationType.ManyToMany:
      return [
        `// ${baseType} belongsToMany ${targetType}${aliasLabel(association)}`,
        `public readonly ${pluralAssociationField}?: ${targetType}[];`,
        `public get${pluralAssociationMethod}!: Sequelize.BelongsToManyGetAssociationsMixin<${targetType}>;`,
        `public set${pluralAssociationMethod}!: Sequelize.BelongsToManySetAssociationsMixin<${targetType}, ${targetType}Id>;`,
        `public add${singularAssociationMethod}!: Sequelize.BelongsToManyAddAssociationMixin<${targetType}, ${targetType}Id>;`,
        `public add${pluralAssociationMethod}!: Sequelize.BelongsToManyAddAssociationsMixin<${targetType}, ${targetType}Id>;`,
        `public create${singularAssociationMethod}!: Sequelize.BelongsToManyCreateAssociationMixin<${targetType}>;`,
        `public remove${singularAssociationMethod}!: Sequelize.BelongsToManyRemoveAssociationMixin<${targetType}, ${targetType}Id>;`,
        `public remove${pluralAssociationMethod}!: Sequelize.BelongsToManyRemoveAssociationsMixin<${targetType}, ${targetType}Id>;`,
        `public has${singularAssociationMethod}!: Sequelize.BelongsToManyHasAssociationMixin<${targetType}, ${targetType}Id>;`,
        `public has${pluralAssociationMethod}!: Sequelize.BelongsToManyHasAssociationsMixin<${targetType}, ${targetType}Id>;`,
        `public count${pluralAssociationMethod}!: Sequelize.BelongsToManyCountAssociationsMixin;`,
        blank(),
      ].join('\n')
  }
}

const aliasLabel = ({ alias }: Association): string => (alias ? ` (as ${pascalCase(alias)})` : '')

const fieldTemplate = ({ name, type, required, primaryKey, unique }: Field): string =>
  `${camelCase(name)}: {
  ${indent(
    2,
    [
      typeField(type),
      primaryKey === undefined ? '' : primaryKeyField(primaryKey),
      type.type === DataTypeType.Integer && type.autoincrement !== undefined
        ? autoincrementField(type.autoincrement)
        : '',
      required === undefined ? '' : allowNullField(!required),
      unique === undefined ? '' : uniqueField(unique),
      // TODO; Unique
    ]
      .filter((x) => x)
      .join(',\n'),
  )}
}`

const typeField = (dataType: DataType): string =>
  `type: ${displaySequelizeDataType(dataTypeToSequelize(dataType))}`
const allowNullField = (allowNull: boolean): string => `allowNull: ${allowNull}`
const primaryKeyField = (primaryKey: boolean): string => `primaryKey: ${primaryKey}`
const uniqueField = (unique: boolean): string => `unique: ${unique}`
const autoincrementField = (autoincrement: boolean) => `autoIncrement: ${autoincrement}`

type ModelOptionsArgs = { modelName: string; options: SchemaOptions }
const modelOptions = ({ modelName, options }: ModelOptionsArgs): string =>
  ['sequelize', tableName({ modelName, options })].filter((x) => x).join(',\n')

type TableNameArgs = {
  modelName: string
  options: SchemaOptions
}
const tableName = ({
  options: { caseStyle, nounForm },
  modelName,
}: TableNameArgs): string | null => {
  if (nounForm === 'singular' && caseStyle === 'snake') {
    return `tableName: '${singular(snakeCase(modelName))}'`
  }
  return null
}

export default modelTemplate
