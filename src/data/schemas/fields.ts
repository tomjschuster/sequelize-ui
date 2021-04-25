import { Model, Schema, stringDataType } from '@src/core/schema'
import shortid from 'shortid'

const Id = {
  Field: shortid(),
} as const

const fields: Model = {
  id: Id.Field,
  name: 'category',
  fields: [
    { id: shortid(), name: 'field', type: stringDataType() },
    { id: shortid(), name: 'pk field', type: stringDataType(), primaryKey: true },
    { id: shortid(), name: 'required field', type: stringDataType(), required: true },
    { id: shortid(), name: 'optional field', type: stringDataType(), unique: true },
  ],
  associations: [],
}

export const fieldsSchema: Schema = {
  id: shortid(),
  name: 'fields',
  models: [fields],
}
