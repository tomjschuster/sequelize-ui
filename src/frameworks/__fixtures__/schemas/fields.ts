import { Model, Schema, stringDataType } from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import shortid from 'shortid'

const time = fromParts(2020, 7, 1)

const Id = {
  Field: shortid(),
} as const

const fields: Model = {
  id: Id.Field,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'field',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: shortid(),
      name: 'pk field',
      type: stringDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: shortid(),
      name: 'required field',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: shortid(),
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
  id: shortid(),
  name: 'fields',
  createdAt: time,
  updatedAt: time,
  forkedFrom: null,
  models: [fields],
}

export default fieldsSchema
