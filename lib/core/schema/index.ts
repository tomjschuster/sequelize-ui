export type Schema = {
  id: string
  name: string
  models: Model[]
}

export type Model = {
  id: string
  name: string
  fields: Field[]
  associations: Association[]
}

export type Field = {
  name: string
  type: DataType
  primaryKey?: boolean
  required?: boolean
  unique?: boolean
}

export type Association =
  | BelongsToAssociation
  | HasOneAssociation
  | HasManyAssociation
  | ManyToManyAssociation

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
      return `Enum ${types ? ` (${types})` : ''}`
    }
    case DataTypeType.Array: {
      const type = displayDataType(dataType.arrayType)
      return `Array ${type}`
    }
    case DataTypeType.Json:
      return 'JSON'
    case DataTypeType.Blob:
      return 'Buffer'
  }
}

export function displayAssociation(association: Association): string {
  switch (association.type) {
    case AssociationType.BelongsTo:
      return 'belongs to'
    case AssociationType.HasMany:
      return 'has many'
    case AssociationType.HasOne:
      return 'has one'
    case AssociationType.ManyToMany:
      return 'many to many'
  }
}

export function isDateTimeType(
  dataType: DataType,
): dataType is DateTimeDataType | DateDataType | TimeDataType {
  return [DataTypeType.DateTime, DataTypeType.Date, DataTypeType.Time].includes(dataType.type)
}

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

export enum AssociationType {
  BelongsTo = 'BELONGS_TO',
  HasOne = 'HAS_ONE',
  HasMany = 'HAS_MANY',
  ManyToMany = 'MANY_TO_MANY',
}

type AssociationBase<T extends AssociationType> = {
  type: T
  targetModelId: string
  foreignKey?: string
  alias?: string
}

export type BelongsToAssociation = AssociationBase<AssociationType.BelongsTo>
export type HasOneAssociation = AssociationBase<AssociationType.HasOne>
export type HasManyAssociation = AssociationBase<AssociationType.HasMany>
export type ManyToManyAssociation = AssociationBase<AssociationType.ManyToMany> & {
  through: ManyToManyThrough
  targetFk?: string
}
export type ManyToManyThrough = ManyToManyThroughModel | ManyToManyThroughTable

type ManyToManyThroughModel = {
  type: ThroughType.ThroughModel
  modelId: string
}

type ManyToManyThroughTable = {
  type: ThroughType.ThroughTable
  table: string
}

export enum ThroughType {
  ThroughModel = 'THROUGH_MODEL',
  ThroughTable = 'THROUGH_TABLE',
}
