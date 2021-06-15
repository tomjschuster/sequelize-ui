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
    { id: shortid(), name: 'field', type: stringDataType() },
    { id: shortid(), name: 'pk field', type: stringDataType(), primaryKey: true },
    { id: shortid(), name: 'required field', type: stringDataType(), required: true },
    { id: shortid(), name: 'optional field', type: stringDataType(), unique: true },
  ],
  associations: [],
}

const fieldsSchema: Schema = {
  id: shortid(),
  name: 'fields',
  createdAt: time,
  updatedAt: time,
  models: [fields],
}

export default fieldsSchema
