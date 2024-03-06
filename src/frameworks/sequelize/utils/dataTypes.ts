import { displaySqlDialect, SqlDialect } from '@src/core/database'
import {
  ArrayDataType,
  DataType,
  DataTypeType,
  EnumDataType,
  isJsonDataType,
  isNumberType,
  isNumericType,
  isStringType,
  Model,
  NumberType,
  NumericType,
  StringType,
  UuidType,
} from '@src/core/schema'

export function dataTypeToTypeScript(dataType: DataType): string {
  switch (dataType.type) {
    case DataTypeType.String:
    case DataTypeType.Text:
    case DataTypeType.CiText:
    case DataTypeType.Uuid:
    case DataTypeType.Time:
    case DataTypeType.Date:
      return 'string'
    case DataTypeType.DateTime:
      return 'Date'
    case DataTypeType.Integer:
    case DataTypeType.BigInt:
    case DataTypeType.SmallInt:
    case DataTypeType.Float:
    case DataTypeType.Real:
    case DataTypeType.Double:
    case DataTypeType.Decimal:
      return 'number'
    case DataTypeType.Boolean:
      return 'boolean'
    case DataTypeType.Enum:
      return dataType.values.length > 0 ? dataType.values.map((x) => `'${x}'`).join(' | ') : 'never'
    case DataTypeType.Array:
      if (dataType.arrayType.type === DataTypeType.Enum) {
        return `Array<${dataTypeToTypeScript(dataType.arrayType)}>`
      }
      return `${dataTypeToTypeScript(dataType.arrayType)}[]`
    case DataTypeType.Json:
    case DataTypeType.JsonB:
      return 'Json'
    case DataTypeType.Blob:
      return 'Buffer'
  }
}

const postgresTypes: DataTypeType[] = [DataTypeType.Array, DataTypeType.JsonB, DataTypeType.CiText]
const nonMssqlTypes: DataTypeType[] = [DataTypeType.Json]

export function dataTypeNotSupported(dataType: DataType, dialect: SqlDialect): boolean {
  if (dialect === SqlDialect.MsSql && nonMssqlTypes.includes(dataType.type)) {
    return true
  }

  if (dialect !== SqlDialect.Postgres && postgresTypes.includes(dataType.type)) {
    return true
  }

  return false
}

export function displaySequelizeDataType(dataType: DataType): string {
  return `${displayBaseDataType(dataType)}${displayDataTypeOptions(dataType)}`
}

export function sequelizeUuidVersion(uuidType: UuidType): string {
  switch (uuidType) {
    case UuidType.V1:
      return `DataTypes.UUIDV1`
    case UuidType.V4:
      return `DataTypes.UUIDV4`
  }
}

function displayBaseDataType(dataType: DataType): string {
  return `DataTypes.${dataTypeToSequelize(dataType)}`
}

enum SequelizeDataType {
  String = 'STRING',
  Text = 'TEXT',
  CiText = 'CITEXT',
  Integer = 'INTEGER',
  BigInt = 'BIGINT',
  SmallInt = 'SMALLINT',
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
  JsonB = 'JSONB',
  Blob = 'BLOB',
  Uuid = 'UUID',
}

function dataTypeToSequelize(dataType: DataType): SequelizeDataType {
  switch (dataType.type) {
    case DataTypeType.String:
      return SequelizeDataType.String
    case DataTypeType.Text:
      return SequelizeDataType.Text
    case DataTypeType.CiText:
      return SequelizeDataType.CiText
    case DataTypeType.Integer:
      return SequelizeDataType.Integer
    case DataTypeType.BigInt:
      return SequelizeDataType.BigInt
    case DataTypeType.SmallInt:
      return SequelizeDataType.SmallInt
    case DataTypeType.Float:
      return SequelizeDataType.Float
    case DataTypeType.Real:
      return SequelizeDataType.Real
    case DataTypeType.Double:
      return SequelizeDataType.Double
    case DataTypeType.Decimal:
      return SequelizeDataType.Decimal
    case DataTypeType.DateTime:
      return SequelizeDataType.Date
    case DataTypeType.Date:
      return SequelizeDataType.Dateonly
    case DataTypeType.Time:
      return SequelizeDataType.Time
    case DataTypeType.Boolean:
      return SequelizeDataType.Boolean
    case DataTypeType.Enum:
      return SequelizeDataType.Enum
    case DataTypeType.Array:
      return SequelizeDataType.Array
    case DataTypeType.Json:
      return SequelizeDataType.Json
    case DataTypeType.JsonB:
      return SequelizeDataType.JsonB
    case DataTypeType.Blob:
      return SequelizeDataType.Blob
    case DataTypeType.Uuid:
      return SequelizeDataType.Uuid
  }
}

function displayDataTypeOptions(dataType: DataType): string {
  if (isStringType(dataType)) return displayString(dataType)
  if (isNumericType(dataType)) return displayNumeric(dataType)
  if (isNumberType(dataType)) return displayNumber(dataType)
  if (dataType.type === DataTypeType.Enum) return displayEnum(dataType)
  if (dataType.type === DataTypeType.Array) return displayArray(dataType)
  return ''
}

function displayString(dataType: StringType): string {
  return dataType.length ? `(${dataType.length})` : ''
}

function displayNumber(dataType: NumberType): string {
  return dataType.unsigned ? '.UNSIGNED' : ''
}

function displayNumeric(dataType: NumericType): string {
  const { precision } = dataType

  const numeric = precision
    ? `(${precision.precision}${precision.scale ? `, ${precision.scale}` : ''})`
    : ''

  return `${numeric}${displayNumber(dataType)}`
}

function displayEnum(dataType: EnumDataType): string {
  return `(${dataType.values.map((x) => `'${x}'`).join(', ')})`
}

function displayArray(dataType: ArrayDataType): string {
  return `(${displaySequelizeDataType(dataType.arrayType)})`
}

export function hasJsonType(model: Model): boolean {
  return model.fields.some((f) => isJsonDataType(f.type))
}

export function notSupportedComment(type: DataType, dialect: SqlDialect): string {
  return dataTypeNotSupported(type, dialect) ? '// ' : ''
}

export function noSupportedDetails(type: DataType, dialect: SqlDialect): string | null {
  if (!dataTypeNotSupported(type, dialect)) return null

  const typeDisplay = displaySequelizeDataType(type)
  return `//// ${typeDisplay} not supported for ${displaySqlDialect(dialect)}`
}
