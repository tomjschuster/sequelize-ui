export enum AssociationType {
  BelongsTo = 'BELONGS_TO',
  HasOne = 'HAS_ONE',
  HasMany = 'HAS_MANY',
  ManyToMany = 'MANY_TO_MANY',
}

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

export type StringDataType = { type: DataTypeType.String }
export type TextDataType = { type: DataTypeType.Text }
export type IntegerDataType = { type: DataTypeType.Integer }
export type FloatDataType = { type: DataTypeType.Float }
export type RealDataType = { type: DataTypeType.Real }
export type DoubleDataType = { type: DataTypeType.Double }
export type DecimalDataType = { type: DataTypeType.Decimal }
export type DateTimeDataType = { type: DataTypeType.DateTime }
export type DateDataType = { type: DataTypeType.Date }
export type TimeDataType = { type: DataTypeType.Time }
export type BooleanDataType = { type: DataTypeType.Boolean }
export type EnumDataType = { type: DataTypeType.Enum; values: string[] }
export type ArrayDataType = { type: DataTypeType.Array; arrayType: DataType }
export type JsonDataType = { type: DataTypeType.Json }
export type BlobDataType = { type: DataTypeType.Blob }
export type UuidDataType = { type: DataTypeType.Uuid }

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

type AssociationBase = { foreignKey?: string; alias?: string }
export type BelongsTo = { type: AssociationType.BelongsTo } & AssociationBase
export type HasOne = { type: AssociationType.HasOne } & AssociationBase
export type HasMany = { type: AssociationType.HasMany } & AssociationBase
export type ManyToMany = {
  type: AssociationType.ManyToMany
  through: string
  targetFk?: string
} & AssociationBase

export type Association = BelongsTo | HasOne | HasMany | ManyToMany

export type Field = {
  name: string
  type: DataType
  primaryKey?: boolean
  required?: boolean
  unique?: boolean
}

export type ModelAssociation = {
  modelName: string
} & Association
