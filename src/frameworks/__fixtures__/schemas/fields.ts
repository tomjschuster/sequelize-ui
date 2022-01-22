import { Model, Schema, stringDataType } from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { uniqueId } from '@src/utils/string'

const time = fromParts(2020, 7, 1)

const Id = {
  Field: uniqueId(),
} as const

const fields: Model = {
  id: Id.Field,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: uniqueId(),
      name: 'field',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'pk field',
      type: stringDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'required field',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'optional field',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: true,
    },
  ],
  associations: [],
}

const fieldsSchema: Schema = {
  id: uniqueId(),
  name: 'fields',
  createdAt: time,
  updatedAt: time,
  forkedFrom: null,
  models: [fields],
}

export default fieldsSchema
