import { plural, singular } from 'pluralize'
import { camelCase } from 'camel-case'
/*
  TODO:
    - Snake case
    - Timestamps
    - Singular table names
    - Other files
*/

// Utils
function indent(depth: number, value: string): string {
  return value
    .split('\n')
    .map((x, i) => (i !== 0 && x ? ' '.repeat(depth) + x : x))
    .join('\n')
}

function blank(): string {
  return ''
}

function pluralize(value: string): string {
  return plural(value)
}

function singularize(value: string): string {
  return singular(value)
}

function camelize(value: string): string {
  return camelCase(value)
}

type TypeImportArgs = {
  filename: string
  types: string[]
}
const typeImports = ({ filename, types }: TypeImportArgs): string =>
  `import type { ${types.join(', ')} } from './${filename}'`

// Types
enum AssociationType {
  BelongsTo = 'BELONGS_TO',
  HasOne = 'HAS_ONE',
  HasMany = 'HAS_MANY',
  ManyToMany = 'MANY_TO_MANY',
}

enum DataTypeType {
  String = 'STRING',
  Text = 'TEXT',
  Integer = 'INTEGER',
  Float = 'FLOAT',
  Real = 'REAL',
  Double = 'DOUBLE',
  Decimal = 'DECIMAL',
  DateTime = 'DATE_TIME',
  Date = 'DATE',
  Time = 'TIME',
  Boolean = 'BOOLEAN',
  Enum = 'ENUM',
  Array = 'ARRAY',
  Json = 'JSON',
  Blob = 'BLOB',
  Uuid = 'UUID',
}

type StringDataType = { type: DataTypeType.String }
type TextDataType = { type: DataTypeType.Text }
type IntegerDataType = { type: DataTypeType.Integer }
type FloatDataType = { type: DataTypeType.Float }
type RealDataType = { type: DataTypeType.Real }
type DoubleDataType = { type: DataTypeType.Double }
type DecimalDataType = { type: DataTypeType.Decimal }
type DateTimeDataType = { type: DataTypeType.DateTime }
type DateDataType = { type: DataTypeType.Date }
type TimeDataType = { type: DataTypeType.Time }
type BooleanDataType = { type: DataTypeType.Boolean }
type EnumDataType = { type: DataTypeType.Enum; values: string[] }
type ArrayDataType = { type: DataTypeType.Array; arrayType: DataType }
type JsonDataType = { type: DataTypeType.Json }
type BlobDataType = { type: DataTypeType.Blob }
type UuidDataType = { type: DataTypeType.Uuid }

type DataType =
  | StringDataType
  | TextDataType
  | IntegerDataType
  | FloatDataType
  | RealDataType
  | DoubleDataType
  | DecimalDataType
  | DateTimeDataType
  | DateDataType
  | TimeDataType
  | BooleanDataType
  | EnumDataType
  | ArrayDataType
  | JsonDataType
  | BlobDataType
  | UuidDataType

enum SequelizeDataTypeType {
  String = 'STRING',
  Text = 'TEXT',
  Integer = 'INTEGER',
  Float = 'FLOAT',
  Real = 'REAL',
  Double = 'DOUBLE',
  Decimal = 'DECIMAL',
  Date = 'DATE',
  Dateonly = 'DATEONLY',
  Time = 'TIME',
  Boolean = 'BOOLEAN',
  Enum = 'ENUM',
  Array = 'ARRAY',
  Json = 'JSON',
  Blob = 'BLOB',
  Uuid = 'UUID',
}

type SequelizeStringType = { type: SequelizeDataTypeType.String }
type SequelizeTextType = { type: SequelizeDataTypeType.Text }
type SequelizeIntegerType = { type: SequelizeDataTypeType.Integer }
type SequelizeFloatType = { type: SequelizeDataTypeType.Float }
type SequelizeRealType = { type: SequelizeDataTypeType.Real }
type SequelizeDoubleType = { type: SequelizeDataTypeType.Double }
type SequelizeDecimalType = { type: SequelizeDataTypeType.Decimal }
type SequelizeDateType = { type: SequelizeDataTypeType.Date }
type SequelizeDateonlyType = { type: SequelizeDataTypeType.Dateonly }
type SequelizeTimeType = { type: SequelizeDataTypeType.Time }
type SequelizeBooleanType = { type: SequelizeDataTypeType.Boolean }
type SequelizeEnumType = { type: SequelizeDataTypeType.Enum; values: string[] }
type SequelizeArrayType = { type: SequelizeDataTypeType.Array; arrayType: SequelizeDataType }
type SequelizeJsonType = { type: SequelizeDataTypeType.Json }
type SequelizeBlobType = { type: SequelizeDataTypeType.Blob }
type SequelizeUuidType = { type: SequelizeDataTypeType.Uuid }

type SequelizeDataType =
  | SequelizeStringType
  | SequelizeTextType
  | SequelizeIntegerType
  | SequelizeFloatType
  | SequelizeRealType
  | SequelizeDoubleType
  | SequelizeDecimalType
  | SequelizeDateType
  | SequelizeDateonlyType
  | SequelizeTimeType
  | SequelizeBooleanType
  | SequelizeEnumType
  | SequelizeArrayType
  | SequelizeJsonType
  | SequelizeBlobType
  | SequelizeUuidType

function displaySequelizeDataType(dataType: SequelizeDataType): string {
  switch (dataType.type) {
    case SequelizeDataTypeType.Enum:
      return `DataTypes.${SequelizeDataTypeType.Enum}(${dataType.values
        .map((x) => `'${x}'`)
        .join(', ')})`
    case SequelizeDataTypeType.Array:
      return `DataTypes.${SequelizeDataTypeType.Array}(${displaySequelizeDataType(
        dataType.arrayType,
      )})`
    default:
      return `DataTypes.${dataType.type}`
  }
}

function dataTypeToSequelize(dataType: DataType): SequelizeDataType {
  switch (dataType.type) {
    case DataTypeType.String:
      return { type: SequelizeDataTypeType.String }
    case DataTypeType.Text:
      return { type: SequelizeDataTypeType.Text }
    case DataTypeType.Integer:
      return { type: SequelizeDataTypeType.Integer }
    case DataTypeType.Float:
      return { type: SequelizeDataTypeType.Float }
    case DataTypeType.Real:
      return { type: SequelizeDataTypeType.Real }
    case DataTypeType.Double:
      return { type: SequelizeDataTypeType.Double }
    case DataTypeType.Decimal:
      return { type: SequelizeDataTypeType.Decimal }
    case DataTypeType.DateTime:
      return { type: SequelizeDataTypeType.Date }
    case DataTypeType.Date:
      return { type: SequelizeDataTypeType.Dateonly }
    case DataTypeType.Time:
      return { type: SequelizeDataTypeType.Time }
    case DataTypeType.Boolean:
      return { type: SequelizeDataTypeType.Boolean }
    case DataTypeType.Enum:
      return { type: SequelizeDataTypeType.Enum, values: dataType.values }
    case DataTypeType.Array:
      return {
        type: SequelizeDataTypeType.Array,
        arrayType: dataTypeToSequelize(dataType.arrayType),
      }
    case DataTypeType.Json:
      return { type: SequelizeDataTypeType.Json }
    case DataTypeType.Blob:
      return { type: SequelizeDataTypeType.Blob }
    case DataTypeType.Uuid:
      return { type: SequelizeDataTypeType.Uuid }
  }
}

function dataTypeToTypeScript(dataType: DataType): string {
  switch (dataType.type) {
    case DataTypeType.String:
    case DataTypeType.Text:
    case DataTypeType.Uuid:
    case DataTypeType.DateTime:
    case DataTypeType.Time:
    case DataTypeType.Date:
      return 'string'
    case DataTypeType.Integer:
    case DataTypeType.Float:
    case DataTypeType.Real:
    case DataTypeType.Double:
    case DataTypeType.Decimal:
      return 'number'
    case DataTypeType.Boolean:
      return 'boolean'
    case DataTypeType.Enum:
      return dataType.values.map((x) => `'${x}'`).join(' | ')
    case DataTypeType.Array:
      return `${dataTypeToTypeScript(dataType.arrayType)}[]`
    case DataTypeType.Json:
      // TODO
      return '?'
    case DataTypeType.Blob:
      // ?
      return 'Buffer'
  }
}

type AssociationBase = { foreignKey?: string; alias?: string }
type BelongsTo = { type: AssociationType.BelongsTo } & AssociationBase
type HasOne = { type: AssociationType.HasOne } & AssociationBase
type HasMany = { type: AssociationType.HasMany } & AssociationBase
type ManyToMany = {
  type: AssociationType.ManyToMany
  through: string
  targetFk?: string
} & AssociationBase

type Association = BelongsTo | HasOne | HasMany | ManyToMany

type Field = {
  name: string
  type: DataType
  primaryKey?: boolean
  required?: boolean
  unique?: boolean
}

type ModelAssociation = {
  modelName: string
} & Association

type ModelTemplateArgs = {
  modelName: string
  fields: Field[]
  associations: ModelAssociation[]
}
const modelTemplate = ({ modelName, fields, associations }: ModelTemplateArgs): string =>
  [
    imports({ modelName, associations }),
    blank(),
    types({ modelName, fields }),
    blank(),
    classDeclaration({ modelName, fields, associations }),
  ].join('\n')

// Imports
type ImportsArgs = {
  modelName: string
  associations: ModelAssociation[]
}
const imports = ({ modelName, associations }: ImportsArgs): string =>
  [
    sequelizeImports(),
    ...getAssociationTypes({ modelName, associations }).map(([filename, types]) =>
      typeImports({ filename, types }),
    ),
  ].join('\n')

const sequelizeImports = (): string =>
  `import Sequelize, { DataTypes, Model, Optional } from 'sequelize';`

type ModelAssociationTypes = { [modelName: string]: AssociationTypeLookup }
type AssociationTypeLookup = { [type: string]: boolean }

type GetAssociationTypes = {
  modelName: string
  associations: ModelAssociation[]
}
const getAssociationTypes = ({
  modelName,
  associations,
}: GetAssociationTypes): Array<[filename: string, types: string[]]> => {
  const associationTypesByModel = associations.reduce<ModelAssociationTypes>((acc, association) => {
    if (association.modelName === modelName) {
      return acc
    }

    const types = associationTypes(association).reduce<AssociationTypeLookup>((acc, type) => {
      acc[type] = true
      return acc
    }, acc[association.modelName] || {})

    acc[association.modelName] = types

    return acc
  }, {})

  return Object.entries(associationTypesByModel)
    .sort(([modelNameA], [modelNameB]) => modelNameA.localeCompare(modelNameB))
    .map(([modelName, types]) => [modelName, Object.keys(types).sort((a, b) => a.localeCompare(b))])
}

const associationTypes = ({ modelName, type }: ModelAssociation): string[] =>
  [
    modelName,
    `${modelName}Id`,
    type === AssociationType.HasOne ? `${modelName}CreationAttributes` : null,
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
  `export interface ${modelName}Attributes {
  ${indent(2, fields.map(attributeType).join('\n'))}
}`

const attributeType = ({ name, type, required }: Field): string =>
  `${name}${required ? '?' : ''}: ${dataTypeToTypeScript(type)};`

type IdTypesArgs = {
  modelName: string
  fields: Field[]
}
const idTypes = ({ modelName, fields }: IdTypesArgs): string =>
  `export type ${modelName}Pk = ${fields
    .filter((f) => f.primaryKey)
    .map((f) => `'${f.name}'`)
    .join(' | ')}
export type ${modelName}Id = ${modelName}Attributes[${modelName}Pk]`

const creationAttributeType = (modelName: string): string =>
  `export type ${modelName}CreationAttributes = Optional<${modelName}Attributes, ${modelName}Pk>;`

// Class
type ClassDeclarationArgs = {
  modelName: string
  fields: Field[]
  associations: ModelAssociation[]
}
const classDeclaration = ({ modelName, fields, associations }: ClassDeclarationArgs): string =>
  `export class ${modelName} extends Model<${modelName}Attributes, ${modelName}CreationAttributes> implements ${modelName}Attributes {
  ${indent(2, fields.map(classFieldType).join('\n'))}${associations.length ? '\n' : ''}
  ${indent(2, associations.map((a) => associationType({ modelName, association: a })).join('\n'))}
  static initModel(sequelize: Sequelize.Sequelize): typeof ${modelName} {
    ${modelName}.init({
    ${indent(4, fields.map(fieldTemplate).join(',\n'))}
    }, {
      sequelize,
      ${/* TODO: config */ blank()}
    });

    return ${modelName};
  }
}`

const classFieldType = ({ name, type, required, primaryKey }: Field): string =>
  `public ${primaryKey ? 'readonly ' : ''}${name}${required ? '?' : '!'}: ${dataTypeToTypeScript(
    type,
  )};`

type AssociationTypeArgs = {
  modelName: string
  association: ModelAssociation
}
const associationType = ({
  modelName: baseModelName,
  association: { modelName, type },
}: AssociationTypeArgs): string => {
  const singularName = singularize(modelName)
  const pluralName = pluralize(modelName)

  switch (type) {
    case AssociationType.BelongsTo:
      return [
        `// ${baseModelName} belongsTo ${modelName}`,
        `public readonly ${camelize(singularName)}?: ${modelName};`,
        `public get${singularName}!: Sequelize.BelongsToGetAssociationMixin<${modelName}>;`,
        `public set${singularName}!: Sequelize.BelongsToSetAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public create${singularName}!: Sequelize.BelongsToCreateAssociationMixin<${modelName}>;`,
        blank(),
      ].join('\n')
    case AssociationType.HasMany:
      return [
        `// ${baseModelName} hasMany ${modelName}`,
        `public readonly ${camelize(pluralName)}?: ${modelName}[];`,
        `public get${pluralName}!: Sequelize.HasManyGetAssociationsMixin<${modelName}>;`,
        `public set${pluralName}!: Sequelize.HasManySetAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public add${singularName}!: Sequelize.HasManyAddAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public add${pluralName}!: Sequelize.HasManyAddAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public create${singularName}!: Sequelize.HasManyCreateAssociationMixin<${modelName}>;`,
        `public remove${singularName}!: Sequelize.HasManyRemoveAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public remove${pluralName}!: Sequelize.HasManyRemoveAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public has${singularName}!: Sequelize.HasManyHasAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public has${pluralName}!: Sequelize.HasManyHasAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public count${pluralName}!: Sequelize.HasManyCountAssociationsMixin;`,
        blank(),
      ].join('\n')
    case AssociationType.HasOne:
      return [
        `// ${baseModelName} hasOne ${modelName}`,
        `public readonly ${camelize(singularName)}?: ${modelName};`,
        `public get${singularName}!: Sequelize.HasOneGetAssociationMixin<${modelName}>;`,
        `public set${singularName}!: Sequelize.HasOneSetAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public create${singularName}!: Sequelize.HasOneCreateAssociationMixin<${modelName}CreationAttributes>;`,
        blank(),
      ].join('\n')
    case AssociationType.ManyToMany:
      return [
        `// ${baseModelName} belonsToMany ${modelName}`,
        `public readonly ${camelize(pluralName)}?: ${modelName}[];`,
        `public get${pluralName}!: Sequelize.BelongsToManyGetAssociationsMixin<${modelName}>;`,
        `public set${pluralName}!: Sequelize.BelongsToManySetAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public add${singularName}!: Sequelize.BelongsToManyAddAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public add${pluralName}!: Sequelize.BelongsToManyAddAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public create${singularName}!: Sequelize.BelongsToManyCreateAssociationMixin<${modelName}>;`,
        `public remove${singularName}!: Sequelize.BelongsToManyRemoveAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public remove${pluralName}!: Sequelize.BelongsToManyRemoveAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public has${singularName}!: Sequelize.BelongsToManyHasAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public has${pluralName}!: Sequelize.BelongsToManyHasAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public count${pluralName}!: Sequelize.BelongsToManyCountAssociationsMixin;`,
        blank(),
      ].join('\n')
  }
}

const fieldTemplate = ({ name, type, required, primaryKey, unique }: Field): string =>
  `${name}: {
  ${indent(
    2,
    [
      typeField(type),
      required === undefined ? '' : allowNullField(!required),
      primaryKey === undefined ? '' : primaryKeyField(primaryKey),
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

// Data
const data: ModelTemplateArgs = {
  modelName: 'Post',
  associations: [
    { modelName: 'User', type: AssociationType.BelongsTo, alias: 'author' },
    { modelName: 'Comment', type: AssociationType.HasMany },
    { modelName: 'Post', type: AssociationType.HasOne, alias: 'parent' },
    { modelName: 'Comment', type: AssociationType.HasOne, alias: 'best' },
    { modelName: 'Deer', type: AssociationType.HasMany },
    { modelName: 'OtherThing', type: AssociationType.HasMany },
  ],
  fields: [
    { name: 'id', type: { type: DataTypeType.Integer }, primaryKey: true },
    { name: 'otherId', type: { type: DataTypeType.Integer }, primaryKey: true, unique: true },
    { name: 'title', type: { type: DataTypeType.String }, required: true, unique: true },
    { name: 'content', type: { type: DataTypeType.Text } },
    {
      name: 'foo',
      type: { type: DataTypeType.Array, arrayType: { type: DataTypeType.Float } },
      required: false,
      unique: false,
    },
    {
      name: 'bar',
      type: { type: DataTypeType.Enum, values: ['hello', 'world'] },
      required: false,
      unique: false,
    },
  ],
}

console.log(modelTemplate(data))
