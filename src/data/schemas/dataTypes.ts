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
  floatDataType,
  integerDataType,
  jsonBDataType,
  jsonDataType,
  Model,
  realDataType,
  Schema,
  smallIntDataType,
  stringDataType,
  textDataType,
  timeDataType,
  uuidDataType,
  UuidType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import shortid from 'shortid'

const time = fromParts(2021, 1, 1)

const Id = {
  DataType: shortid(),
} as const

const dataTypes: Model = {
  id: Id.DataType,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'string', type: stringDataType() },
    { id: shortid(), name: 'string with length', type: stringDataType({ length: 100 }) },
    { id: shortid(), name: 'text', type: textDataType() },
    { id: shortid(), name: 'ci text', type: ciTextDataType() },
    { id: shortid(), name: 'integer', type: integerDataType() },
    { id: shortid(), name: 'integer unsigned', type: integerDataType({ unsigned: true }) },
    {
      id: shortid(),
      name: 'integer autoincrement',
      type: integerDataType({ autoincrement: true }),
    },
    { id: shortid(), name: 'big int', type: bigIntDataType() },
    { id: shortid(), name: 'small int', type: smallIntDataType() },
    { id: shortid(), name: 'float', type: floatDataType() },
    { id: shortid(), name: 'real', type: realDataType() },
    { id: shortid(), name: 'double', type: doubleDataType() },
    { id: shortid(), name: 'decimal', type: decimalDataType() },
    {
      id: shortid(),
      name: 'decimal precision',
      type: decimalDataType({ precision: { precision: 14 } }),
    },
    {
      id: shortid(),
      name: 'decimal precision and scale',
      type: decimalDataType({ precision: { precision: 14, scale: 2 } }),
    },
    { id: shortid(), name: 'date time', type: dateTimeDataType() },
    { id: shortid(), name: 'date time default now', type: dateTimeDataType({ defaultNow: true }) },
    { id: shortid(), name: 'date', type: dateDataType() },
    { id: shortid(), name: 'date default now', type: dateDataType({ defaultNow: true }) },
    { id: shortid(), name: 'time', type: timeDataType() },
    { id: shortid(), name: 'time default now', type: timeDataType({ defaultNow: true }) },
    { id: shortid(), name: 'boolean', type: booleanDataType() },
    { id: shortid(), name: 'enum', type: enumDataType() },
    { id: shortid(), name: 'array', type: arrayDataType() },
    { id: shortid(), name: 'json', type: jsonDataType() },
    { id: shortid(), name: 'json b', type: jsonBDataType() },
    { id: shortid(), name: 'blob', type: blobDataType() },
    { id: shortid(), name: 'uuid', type: uuidDataType() },
    { id: shortid(), name: 'uuid default v4', type: uuidDataType({ defaultVersion: UuidType.V4 }) },
    { id: shortid(), name: 'uuid default v1', type: uuidDataType({ defaultVersion: UuidType.V1 }) },
  ],
  associations: [],
}

const dataTypesSchema: Schema = {
  id: shortid(),
  name: 'data types',
  createdAt: time,
  updatedAt: time,
  models: [dataTypes],
}

export default dataTypesSchema
