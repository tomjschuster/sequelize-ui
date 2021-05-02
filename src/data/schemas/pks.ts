import { integerDataType, Model, Schema } from '@src/core/schema'
import shortid from 'shortid'

const Id = {
  Default: shortid(),
  Id: shortid(),
  Prefixed: shortid(),
  NonStandard: shortid(),
} as const

const defaultPk: Model = {
  id: Id.Default,
  name: 'default',
  fields: [],
  associations: [],
}

const id: Model = {
  id: Id.Id,
  name: 'id',
  fields: [{ id: shortid(), name: 'id', type: integerDataType(), primaryKey: true }],
  associations: [],
}

const prefixed: Model = {
  id: Id.Prefixed,
  name: 'prefixed',
  fields: [{ id: shortid(), name: 'prefixed_id', type: integerDataType(), primaryKey: true }],
  associations: [],
}

const nonstandard: Model = {
  id: Id.NonStandard,
  name: 'nonstandard',
  fields: [{ id: shortid(), name: 'other_id', type: integerDataType(), primaryKey: true }],
  associations: [],
}

const fieldsSchema: Schema = {
  id: shortid(),
  name: 'fields',
  models: [defaultPk, id, prefixed, nonstandard],
}

export default fieldsSchema
