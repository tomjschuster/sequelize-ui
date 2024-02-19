import {
  arrayDataType,
  bigIntDataType,
  blobDataType,
  booleanDataType,
  ciTextDataType,
  dateDataType,
  dateTimeDataType,
  decimalDataType,
  doubleDataType,
  enumDataType,
  field,
  floatDataType,
  integerDataType,
  jsonBDataType,
  jsonDataType,
  model,
  Model,
  realDataType,
  schema,
  Schema,
  smallIntDataType,
  stringDataType,
  textDataType,
  timeDataType,
  uuidDataType,
  UuidType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'

const time = fromParts(2021, 1, 1)

const dataTypes: Model = model({
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'string',
      type: stringDataType(),
    }),
    field({
      name: 'string with length',
      type: stringDataType({ length: 100 }),
    }),
    field({
      name: 'text',
      type: textDataType(),
    }),
    field({
      name: 'ci text',
      type: ciTextDataType(),
    }),
    field({
      name: 'integer',
      type: integerDataType(),
    }),
    field({
      name: 'integer unsigned',
      type: integerDataType({ unsigned: true }),
    }),
    field({
      name: 'integer autoincrement',
      type: integerDataType({ autoincrement: true }),
    }),
    field({
      name: 'big int',
      type: bigIntDataType(),
    }),
    field({
      name: 'small int',
      type: smallIntDataType(),
    }),
    field({
      name: 'float',
      type: floatDataType(),
    }),
    field({
      name: 'real',
      type: realDataType(),
    }),
    field({
      name: 'double',
      type: doubleDataType(),
    }),
    field({
      name: 'decimal',
      type: decimalDataType(),
    }),
    field({
      name: 'decimal precision',
      type: decimalDataType({ precision: { precision: 14, scale: null } }),
    }),
    field({
      name: 'decimal precision and scale',
      type: decimalDataType({ precision: { precision: 14, scale: 2 } }),
    }),
    field({
      name: 'date time',
      type: dateTimeDataType(),
    }),
    field({
      name: 'date time default now',
      type: dateTimeDataType({ defaultNow: true }),
    }),
    field({
      name: 'date',
      type: dateDataType(),
    }),
    field({
      name: 'date default now',
      type: dateDataType({ defaultNow: true }),
    }),
    field({
      name: 'time',
      type: timeDataType(),
    }),
    field({
      name: 'time default now',
      type: timeDataType({ defaultNow: true }),
    }),
    field({
      name: 'boolean',
      type: booleanDataType(),
    }),
    field({
      name: 'enum',
      type: enumDataType(),
    }),
    field({
      name: 'array',
      type: arrayDataType(),
    }),
    field({
      name: 'json',
      type: jsonDataType(),
    }),
    field({
      name: 'json b',
      type: jsonBDataType(),
    }),
    field({
      name: 'blob',
      type: blobDataType(),
    }),
    field({
      name: 'uuid',
      type: uuidDataType(),
    }),
    field({
      name: 'uuid default v4',
      type: uuidDataType({ defaultVersion: UuidType.V4 }),
    }),
    field({
      name: 'uuid default v1',
      type: uuidDataType({ defaultVersion: UuidType.V1 }),
    }),
  ],
})

const dataTypesSchema: Schema = schema({
  name: 'data types',
  createdAt: time,
  updatedAt: time,
  models: [dataTypes],
})

export default dataTypesSchema
