import { SqlDialect } from '../../database'
import { DataType, DataTypeType } from '../../schema'

export enum SequelizeDataTypeType {
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
type SequelizeIntegerType = {
  type: SequelizeDataTypeType.Integer
  autoincrement?: boolean
}
type SequelizeFloatType = { type: SequelizeDataTypeType.Float }
type SequelizeRealType = { type: SequelizeDataTypeType.Real }
type SequelizeDoubleType = { type: SequelizeDataTypeType.Double }
type SequelizeDecimalType = { type: SequelizeDataTypeType.Decimal }
type SequelizeDateType = { type: SequelizeDataTypeType.Date }
type SequelizeDateonlyType = { type: SequelizeDataTypeType.Dateonly }
type SequelizeTimeType = { type: SequelizeDataTypeType.Time }
type SequelizeBooleanType = { type: SequelizeDataTypeType.Boolean }
type SequelizeEnumType = {
  type: SequelizeDataTypeType.Enum
  values: string[]
}
type SequelizeArrayType = {
  type: SequelizeDataTypeType.Array
  arrayType: SequelizeDataType
}
type SequelizeJsonType = { type: SequelizeDataTypeType.Json }
type SequelizeBlobType = { type: SequelizeDataTypeType.Blob }
type SequelizeUuidType = { type: SequelizeDataTypeType.Uuid }

export type SequelizeDataType =
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

export function displaySequelizeDataType(dataType: SequelizeDataType): string {
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

export function dataTypeToSequelize(dataType: DataType): SequelizeDataType {
  switch (dataType.type) {
    case DataTypeType.String:
      return { type: SequelizeDataTypeType.String }
    case DataTypeType.Text:
      return { type: SequelizeDataTypeType.Text }
    case DataTypeType.Integer:
      return { type: SequelizeDataTypeType.Integer, autoincrement: dataType.autoincrement }
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

export function dataTypeToTypeScript(dataType: DataType): string {
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
      return 'Json'
    case DataTypeType.Blob:
      return 'Buffer'
  }
}

export function dataTypeNotSupported(dataType: DataType, dialect: SqlDialect): boolean {
  if (dataType.type === DataTypeType.Json) {
    return dialect === SqlDialect.MsSql
  }

  if (dataType.type === DataTypeType.Array) {
    return dialect !== SqlDialect.Postgres
  }

  return false
}
