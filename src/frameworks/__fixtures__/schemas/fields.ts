import { Model, Schema, field, model, schema, stringDataType } from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'

const time = fromParts(2020, 7, 1)

const fields: Model = model({
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'field',
      type: stringDataType(),
    }),
    field({
      name: 'pk field',
      type: stringDataType(),
      primaryKey: true,
    }),
    field({
      name: 'required field',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'optional field',
      type: stringDataType(),
      unique: true,
    }),
  ],
  associations: [],
})

const fieldsSchema: Schema = schema({
  name: 'fields',
  createdAt: time,
  updatedAt: time,
  models: [fields],
})

export default fieldsSchema
