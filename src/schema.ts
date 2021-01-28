export type SchemaOptions = {
  timestamps: boolean
  caseStyle: 'snake' | 'camel'
  nounForm: 'singular' | 'plural'
}

export type Schema = { id: string; name: string; models: Model[] }

export type Model = { id: string; name: string; fields: Field[]; associations: Association[] }

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

export type StringDataType = DataTypeBase<DataTypeType.String>
export type TextDataType = DataTypeBase<DataTypeType.Text>
export type IntegerDataType = DataTypeBase<DataTypeType.Integer>
export type FloatDataType = DataTypeBase<DataTypeType.Float>
export type RealDataType = DataTypeBase<DataTypeType.Real>
export type DoubleDataType = DataTypeBase<DataTypeType.Double>
export type DecimalDataType = DataTypeBase<DataTypeType.Decimal>
export type DateTimeDataType = DataTypeBase<DataTypeType.DateTime>
export type DateDataType = DataTypeBase<DataTypeType.Date>
export type TimeDataType = DataTypeBase<DataTypeType.Time>
export type BooleanDataType = DataTypeBase<DataTypeType.Boolean>
export type EnumDataType = DataTypeBase<DataTypeType.Enum> & { values: string[] }
export type ArrayDataType = DataTypeBase<DataTypeType.Array> & { arrayType: DataType }
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
type ManyToManyThrough =
  | { type: ThroughType.ThroughModel; modelId: string }
  | { type: ThroughType.ThroughTable; table: string }

enum ThroughType {
  ThroughModel = 'THROUGH_MODEL',
  ThroughTable = 'THROUGH_TABLE',
}

export type ModelAssociation = {
  modelName: string
} & Association
