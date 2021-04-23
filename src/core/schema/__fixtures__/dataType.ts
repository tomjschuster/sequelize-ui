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
} from '../dataType'

export const string: StringDataType = { type: DataTypeType.String }
export const text: TextDataType = { type: DataTypeType.Text }
export const ciText: CiTextDataType = { type: DataTypeType.CiText }
export const integer: IntegerDataType = { type: DataTypeType.Integer }
export const bigInt: BigIntDataType = { type: DataTypeType.BigInt }
export const smallInt: SmallIntDataType = { type: DataTypeType.SmallInt }
export const float: FloatDataType = { type: DataTypeType.Float }
export const real: RealDataType = { type: DataTypeType.Real }
export const double: DoubleDataType = { type: DataTypeType.Double }
export const decimal: DecimalDataType = { type: DataTypeType.Decimal }
export const dateTime: DateTimeDataType = { type: DataTypeType.DateTime }
export const date: DateDataType = { type: DataTypeType.Date }
export const time: TimeDataType = { type: DataTypeType.Time }
export const boolean: BooleanDataType = { type: DataTypeType.Boolean }
export const enum_: EnumDataType = { type: DataTypeType.Enum, values: [] }
export const array: ArrayDataType = { type: DataTypeType.Array, arrayType: string }
export const json: JsonDataType = { type: DataTypeType.Json }
export const jsonB: JsonBDataType = { type: DataTypeType.JsonB }
export const blob: BlobDataType = { type: DataTypeType.Blob }
export const uuid: UuidDataType = { type: DataTypeType.Uuid }
