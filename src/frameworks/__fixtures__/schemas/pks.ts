import { integerDataType, Model, Schema } from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { uniqueId } from '@src/utils/string'

const time = fromParts(2020, 4, 1)

const Id = {
  Default: uniqueId(),
  Id: uniqueId(),
  Prefixed: uniqueId(),
  NonStandard: uniqueId(),
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
      id: uniqueId(),
      name: 'id',
      type: integerDataType(),
      primaryKey: true,
      required: false,
      unique: false,
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
      id: uniqueId(),
      name: 'prefixed_id',
      type: integerDataType(),
      primaryKey: true,
      required: false,
      unique: false,
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
      id: uniqueId(),
      name: 'other_id',
      type: integerDataType(),
      primaryKey: true,
      required: false,
      unique: false,
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
  models: [defaultPk, id, prefixed, nonstandard],
}

export default fieldsSchema
