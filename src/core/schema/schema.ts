import { now } from '@src/utils/dateTime'
import shortid from 'shortid'
import { Association, AssociationTypeType } from './association'
import { DataType, DataTypeType } from './dataType'

export type Schema = {
  id: string
  name: string
  models: Model[]
  createdAt: string
  updatedAt: string
}

export type Model = {
  id: string
  name: string
  fields: Field[]
  associations: Association[]
  createdAt: string
  updatedAt: string
}

export type Field = {
  id: string
  name: string
  type: DataType
  primaryKey?: boolean
  required?: boolean
  unique?: boolean
  generated?: boolean
}

export function emptySchema(): Schema {
  const time = now()
  return {
    id: '',
    name: '',
    models: [],
    createdAt: time,
    updatedAt: time,
  }
}

export function emptyModel(): Model {
  const time = now()
  return {
    id: shortid(),
    name: '',
    fields: [],
    associations: [],
    createdAt: time,
    updatedAt: time,
  }
}

export function emptyField(): Field {
  return { id: shortid(), name: '', type: { type: DataTypeType.String } }
}

export function emptyAssociation(
  sourceModelId: Model['id'],
  targetModelId: Model['id'],
): Association {
  return {
    id: shortid(),
    sourceModelId,
    type: { type: AssociationTypeType.BelongsTo },
    targetModelId,
  }
}
