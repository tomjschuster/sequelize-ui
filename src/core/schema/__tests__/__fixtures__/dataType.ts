import {
  ArrayDataType,
  BigIntDataType,
  BlobDataType,
  BooleanDataType,
  CiTextDataType,
  DataTypeType,
  DateDataType,
  DateTimeDataType,
  DecimalDataType,
  DoubleDataType,
  EnumDataType,
  FloatDataType,
  IntegerDataType,
  JsonBDataType,
  JsonDataType,
  RealDataType,
  SmallIntDataType,
  StringDataType,
  TextDataType,
  TimeDataType,
  UuidDataType,
} from '../../dataType'

export const string: StringDataType = { type: DataTypeType.String, length: null }
export const text: TextDataType = { type: DataTypeType.Text }
export const ciText: CiTextDataType = { type: DataTypeType.CiText }
export const integer: IntegerDataType = {
  type: DataTypeType.Integer,
  unsigned: false,
  autoincrement: false,
}
export const bigInt: BigIntDataType = {
  type: DataTypeType.BigInt,
  unsigned: false,
  autoincrement: false,
}
export const smallInt: SmallIntDataType = {
  type: DataTypeType.SmallInt,
  unsigned: false,
  autoincrement: false,
}
export const float: FloatDataType = { type: DataTypeType.Float, unsigned: false }
export const real: RealDataType = { type: DataTypeType.Real, unsigned: false }
export const double: DoubleDataType = { type: DataTypeType.Double, unsigned: false }
export const decimal: DecimalDataType = {
  type: DataTypeType.Decimal,
  unsigned: false,
  precision: null,
}
export const dateTime: DateTimeDataType = { type: DataTypeType.DateTime, defaultNow: false }
export const date: DateDataType = { type: DataTypeType.Date, defaultNow: false }
export const time: TimeDataType = { type: DataTypeType.Time, defaultNow: false }
export const boolean: BooleanDataType = { type: DataTypeType.Boolean }
export const enum_: EnumDataType = { type: DataTypeType.Enum, values: [] }
export const array: ArrayDataType = { type: DataTypeType.Array, arrayType: string }
export const json: JsonDataType = { type: DataTypeType.Json }
export const jsonB: JsonBDataType = { type: DataTypeType.JsonB }
export const blob: BlobDataType = { type: DataTypeType.Blob }
export const uuid: UuidDataType = { type: DataTypeType.Uuid, defaultVersion: null }
