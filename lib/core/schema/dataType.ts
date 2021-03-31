export type DataType =
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

type DataTypeBase<T extends DataTypeType> = { type: T }
type DateTimeBase = { defaultNow?: boolean }

export type StringDataType = DataTypeBase<DataTypeType.String>
export type TextDataType = DataTypeBase<DataTypeType.Text>
export type IntegerDataType = DataTypeBase<DataTypeType.Integer> & {
  autoincrement?: boolean
}

export type FloatDataType = DataTypeBase<DataTypeType.Float>
export type RealDataType = DataTypeBase<DataTypeType.Real>
export type DoubleDataType = DataTypeBase<DataTypeType.Double>
export type DecimalDataType = DataTypeBase<DataTypeType.Decimal>
export type DateTimeDataType = DataTypeBase<DataTypeType.DateTime> & DateTimeBase
export type DateDataType = DataTypeBase<DataTypeType.Date> & DateTimeBase
export type TimeDataType = DataTypeBase<DataTypeType.Time> & DateTimeBase
export type BooleanDataType = DataTypeBase<DataTypeType.Boolean>
export type EnumDataType = DataTypeBase<DataTypeType.Enum> & {
  values: string[]
}

export type ArrayDataType = DataTypeBase<DataTypeType.Array> & {
  arrayType: DataType
}

export type JsonDataType = DataTypeBase<DataTypeType.Json>
export type BlobDataType = DataTypeBase<DataTypeType.Blob>
export type UuidDataType = DataTypeBase<DataTypeType.Uuid>

export enum DataTypeType {
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

export function displayDataType(dataType: DataType): string {
  switch (dataType.type) {
    case DataTypeType.String:
      return 'String'
    case DataTypeType.Text:
      return 'Text'
    case DataTypeType.Uuid:
      return 'UUID'
    case DataTypeType.DateTime:
      return 'Date Time'
    case DataTypeType.Time:
      return 'Time'
    case DataTypeType.Date:
      return 'Date'
    case DataTypeType.Integer:
      return 'Integer'
    case DataTypeType.Float:
      return 'Float'
    case DataTypeType.Real:
      return 'Real'
    case DataTypeType.Double:
      return 'Double'
    case DataTypeType.Decimal:
      return 'Decimal'
    case DataTypeType.Boolean:
      return 'Boolean'
    case DataTypeType.Enum: {
      const types = dataType.values.length > 0 ? dataType.values.join(', ') : undefined
      return `Enum${types ? ` (${types})` : ''}`
    }
    case DataTypeType.Array: {
      const type = displayDataType(dataType.arrayType)
      return `Array (${type})`
    }
    case DataTypeType.Json:
      return 'JSON'
    case DataTypeType.Blob:
      return 'Buffer'
  }
}

export function displayDataTypeType(type: DataTypeType): string {
  switch (type) {
    case DataTypeType.String:
      return 'String'
    case DataTypeType.Text:
      return 'Text'
    case DataTypeType.Uuid:
      return 'UUID'
    case DataTypeType.DateTime:
      return 'Date Time'
    case DataTypeType.Time:
      return 'Time'
    case DataTypeType.Date:
      return 'Date'
    case DataTypeType.Integer:
      return 'Integer'
    case DataTypeType.Float:
      return 'Float'
    case DataTypeType.Real:
      return 'Real'
    case DataTypeType.Double:
      return 'Double'
    case DataTypeType.Decimal:
      return 'Decimal'
    case DataTypeType.Boolean:
      return 'Boolean'
    case DataTypeType.Enum:
      return 'Enum'
    case DataTypeType.Array:
      return 'Array'
    case DataTypeType.Json:
      return 'JSON'
    case DataTypeType.Blob:
      return 'Buffer'
  }
}

export function isDateTimeType(
  dataType: DataType,
): dataType is DateTimeDataType | DateDataType | TimeDataType {
  return [DataTypeType.DateTime, DataTypeType.Date, DataTypeType.Time].includes(dataType.type)
}

export function stringDataType(): StringDataType {
  return { type: DataTypeType.String }
}

export function textDataType(): TextDataType {
  return { type: DataTypeType.Text }
}

export function integerDataType(): IntegerDataType {
  return { type: DataTypeType.Integer }
}

export function floatDataType(): FloatDataType {
  return { type: DataTypeType.Float }
}

export function realDataType(): RealDataType {
  return { type: DataTypeType.Real }
}

export function doubleDataType(): DoubleDataType {
  return { type: DataTypeType.Double }
}

export function decimalDataType(): DecimalDataType {
  return { type: DataTypeType.Decimal }
}

export function dateTimeDataType(): DateTimeDataType {
  return { type: DataTypeType.DateTime }
}

export function dateDataType(): DateDataType {
  return { type: DataTypeType.Date }
}

export function timeDataType(): TimeDataType {
  return { type: DataTypeType.Time }
}

export function booleanDataType(): BooleanDataType {
  return { type: DataTypeType.Boolean }
}

export function enumDataType(values: string[] = []): EnumDataType {
  return { type: DataTypeType.Enum, values }
}

export function arrayDataType(arrayType = stringDataType()): ArrayDataType {
  return { type: DataTypeType.Array, arrayType }
}

export function jsonDataType(): JsonDataType {
  return { type: DataTypeType.Json }
}

export function blobDataType(): BlobDataType {
  return { type: DataTypeType.Blob }
}

export function uuidDataType(): UuidDataType {
  return { type: DataTypeType.Uuid }
}

export function dataTypeFromDataTypeType(type: DataTypeType): DataType {
  switch (type) {
    case DataTypeType.String:
      return stringDataType()
    case DataTypeType.Text:
      return textDataType()
    case DataTypeType.Uuid:
      return uuidDataType()
    case DataTypeType.DateTime:
      return dateTimeDataType()
    case DataTypeType.Time:
      return timeDataType()
    case DataTypeType.Date:
      return dateDataType()
    case DataTypeType.Integer:
      return integerDataType()
    case DataTypeType.Float:
      return floatDataType()
    case DataTypeType.Real:
      return realDataType()
    case DataTypeType.Double:
      return doubleDataType()
    case DataTypeType.Decimal:
      return decimalDataType()
    case DataTypeType.Boolean:
      return booleanDataType()
    case DataTypeType.Enum:
      return enumDataType()
    case DataTypeType.Array:
      return arrayDataType()
    case DataTypeType.Json:
      return jsonDataType()
    case DataTypeType.Blob:
      return blobDataType()
  }
}
