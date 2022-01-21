import { integerDataType, Model, Schema } from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import shortid from 'shortid'

const time = fromParts(2020, 4, 1)

const Id = {
  Default: shortid(),
  Id: shortid(),
  Prefixed: shortid(),
  NonStandard: shortid(),
} as const

const defaultPk: Model = {
  id: Id.Default,
  name: 'default',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [],
}

const id: Model = {
  id: Id.Id,
  name: 'id',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'id',
      type: integerDataType(),
      primaryKey: true,
      required: false,
      unique: false,
      generated: false,
    },
  ],
  associations: [],
}

const prefixed: Model = {
  id: Id.Prefixed,
  name: 'prefixed',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'prefixed_id',
      type: integerDataType(),
      primaryKey: true,
      required: false,
      unique: false,
      generated: false,
    },
  ],
  associations: [],
}

const nonstandard: Model = {
  id: Id.NonStandard,
  name: 'nonstandard',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'other_id',
      type: integerDataType(),
      primaryKey: true,
      required: false,
      unique: false,
      generated: false,
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
  models: [defaultPk, id, prefixed, nonstandard],
}

export default fieldsSchema
