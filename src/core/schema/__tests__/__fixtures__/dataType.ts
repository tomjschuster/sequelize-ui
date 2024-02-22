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

export const string: StringDataType = {
  type: DataTypeType.String,
  defaultValue: null,
  length: null,
}
export const text: TextDataType = { type: DataTypeType.Text, defaultValue: null }
export const ciText: CiTextDataType = { type: DataTypeType.CiText, defaultValue: null }
export const integer: IntegerDataType = {
  type: DataTypeType.Integer,
  defaultValue: null,
  unsigned: false,
  autoincrement: false,
}
export const bigInt: BigIntDataType = {
  type: DataTypeType.BigInt,
  defaultValue: null,
  unsigned: false,
  autoincrement: false,
}
export const smallInt: SmallIntDataType = {
  type: DataTypeType.SmallInt,
  defaultValue: null,
  unsigned: false,
  autoincrement: false,
}
export const float: FloatDataType = {
  type: DataTypeType.Float,
  defaultValue: null,
  unsigned: false,
}
export const real: RealDataType = { type: DataTypeType.Real, defaultValue: null, unsigned: false }
export const double: DoubleDataType = {
  type: DataTypeType.Double,
  defaultValue: null,
  unsigned: false,
}
export const decimal: DecimalDataType = {
  type: DataTypeType.Decimal,
  defaultValue: null,
  unsigned: false,
  precision: null,
}
export const dateTime: DateTimeDataType = { type: DataTypeType.DateTime, defaultNow: false }
export const date: DateDataType = { type: DataTypeType.Date, defaultNow: false }
export const time: TimeDataType = { type: DataTypeType.Time, defaultNow: false }
export const boolean: BooleanDataType = { type: DataTypeType.Boolean, defaultValue: null }
export const enum_: EnumDataType = { type: DataTypeType.Enum, values: [], defaultValue: null }
export const array: ArrayDataType = {
  type: DataTypeType.Array,
  arrayType: string,
  defaultEmptyArray: false,
}
export const json: JsonDataType = { type: DataTypeType.Json, defaultValue: null }
export const jsonB: JsonBDataType = { type: DataTypeType.JsonB, defaultValue: null }
export const blob: BlobDataType = { type: DataTypeType.Blob }
export const uuid: UuidDataType = { type: DataTypeType.Uuid, defaultVersion: null }
