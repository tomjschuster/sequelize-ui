import { DataTypeType } from '../dataType'

export const string = { type: DataTypeType.String }
export const text = { type: DataTypeType.Text }
export const ciText = { type: DataTypeType.CiText }
export const integer = { type: DataTypeType.Integer }
export const bigInt = { type: DataTypeType.BigInt }
export const smallInt = { type: DataTypeType.SmallInt }
export const float = { type: DataTypeType.Float }
export const real = { type: DataTypeType.Real }
export const double = { type: DataTypeType.Double }
export const decimal = { type: DataTypeType.Decimal }
export const dateTime = { type: DataTypeType.DateTime }
export const date = { type: DataTypeType.Date }
export const time = { type: DataTypeType.Time }
export const boolean = { type: DataTypeType.Boolean }
export const enum_ = { type: DataTypeType.Enum, values: [] }
export const array = { type: DataTypeType.Array, arrayType: string }
export const json = { type: DataTypeType.Json }
export const jsonB = { type: DataTypeType.JsonB }
export const blob = { type: DataTypeType.Blob }
export const uuid = { type: DataTypeType.Uuid }
