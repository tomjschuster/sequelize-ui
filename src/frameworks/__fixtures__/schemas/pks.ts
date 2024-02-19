import { field, integerDataType, model, Model, schema, Schema } from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'

const time = fromParts(2020, 4, 1)

const defaultPk: Model = model({
  name: 'default',
  createdAt: time,
  updatedAt: time,
})

const id: Model = model({
  name: 'id',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'id',
      type: integerDataType(),
      primaryKey: true,
    }),
  ],
})

const prefixed: Model = model({
  name: 'prefixed',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'prefixed_id',
      type: integerDataType(),
      primaryKey: true,
    }),
  ],
})

const nonstandard: Model = model({
  name: 'nonstandard',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'other_id',
      type: integerDataType(),
      primaryKey: true,
    }),
  ],
})

const fieldsSchema: Schema = schema({
  name: 'fields',
  createdAt: time,
  updatedAt: time,
  models: [defaultPk, id, prefixed, nonstandard],
})

export default fieldsSchema
