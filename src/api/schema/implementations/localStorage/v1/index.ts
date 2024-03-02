// Code generated by jtd-codegen for TypeScript v0.2.1

export type SchemaV1 = Schema

export interface Association {
  id: string
  sourceModelId: string
  targetModelId: string
  type: AssociationType
  alias?: string | null
  foreignKey?: string | null
}

export type AssociationType =
  | AssociationTypeBelongsTo
  | AssociationTypeHasMany
  | AssociationTypeHasOne
  | AssociationTypeManyToMany

export interface AssociationTypeBelongsTo {
  type: 'BELONGS_TO'
}

export interface AssociationTypeHasMany {
  type: 'HAS_MANY'
}

export interface AssociationTypeHasOne {
  type: 'HAS_ONE'
}

export type AssociationTypeManyToManyThrough =
  | AssociationTypeManyToManyThroughThroughModel
  | AssociationTypeManyToManyThroughThroughTable

export interface AssociationTypeManyToManyThroughThroughModel {
  type: 'THROUGH_MODEL'
  modelId: string
}

export interface AssociationTypeManyToManyThroughThroughTable {
  type: 'THROUGH_TABLE'
  table: string
}

export interface AssociationTypeManyToMany {
  type: 'MANY_TO_MANY'
  through: AssociationTypeManyToManyThrough
  targetFk?: string | null
}

export type DataType =
  | DataTypeArray
  | DataTypeBigint
  | DataTypeBlob
  | DataTypeBoolean
  | DataTypeCitext
  | DataTypeDate
  | DataTypeDateTime
  | DataTypeDecimal
  | DataTypeDouble
  | DataTypeEnum
  | DataTypeFloat
  | DataTypeInteger
  | DataTypeJson
  | DataTypeJsonb
  | DataTypeReal
  | DataTypeSmallint
  | DataTypeString
  | DataTypeText
  | DataTypeTime
  | DataTypeUuid

export interface DataTypeArray {
  type: 'ARRAY'
  arrayType: DataType
}

export interface DataTypeBigint {
  type: 'BIGINT'
  autoincrement: boolean
  unsigned: boolean
}

export interface DataTypeBlob {
  type: 'BLOB'
}

export interface DataTypeBoolean {
  type: 'BOOLEAN'
}

export interface DataTypeCitext {
  type: 'CITEXT'
}

export interface DataTypeDate {
  type: 'DATE'
  defaultNow: boolean
}

export interface DataTypeDateTime {
  type: 'DATE_TIME'
  defaultNow: boolean
}

export interface DataTypeDecimalPrecision {
  precision: number
  scale?: number | null
}

export interface DataTypeDecimal {
  type: 'DECIMAL'
  precision: DataTypeDecimalPrecision | null
  unsigned: boolean
}

export interface DataTypeDouble {
  type: 'DOUBLE'
  unsigned: boolean
}

export interface DataTypeEnum {
  type: 'ENUM'
  values: string[]
}

export interface DataTypeFloat {
  type: 'FLOAT'
  unsigned: boolean
}

export interface DataTypeInteger {
  type: 'INTEGER'
  autoincrement: boolean
  unsigned: boolean
}

export interface DataTypeJson {
  type: 'JSON'
}

export interface DataTypeJsonb {
  type: 'JSONB'
}

export interface DataTypeReal {
  type: 'REAL'
  unsigned: boolean
}

export interface DataTypeSmallint {
  type: 'SMALLINT'
  autoincrement: boolean
  unsigned: boolean
}

export interface DataTypeString {
  type: 'STRING'
  length?: number | null
}

export interface DataTypeText {
  type: 'TEXT'
}

export interface DataTypeTime {
  type: 'TIME'
  defaultNow: boolean
}

export enum DataTypeUuidDefaultVersion {
  V1 = 'V1',
  V4 = 'V4',
}

export interface DataTypeUuid {
  type: 'UUID'
  defaultVersion?: DataTypeUuidDefaultVersion | null
}

export interface Field {
  id: string
  name: string
  primaryKey: boolean
  required: boolean
  type: DataType
  unique: boolean
}

export interface Model {
  associations: Association[]
  createdAt: string
  fields: Field[]
  id: string
  name: string
  updatedAt: string
  softDelete?: boolean
}

export interface Schema {
  createdAt: string
  id: string
  models: Model[]
  name: string
  updatedAt: string
  forkedFrom?: string | null
}
