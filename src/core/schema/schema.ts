import { now } from '@src/utils/dateTime'
import shortid from 'shortid'
import { stringDataType } from '.'
import { Association, AssociationTypeType } from './association'
import { DataType } from './dataType'

export type Schema = {
  id: string
  name: string
  models: Model[]
  forkedFrom: string | null
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
  primaryKey: boolean
  required: boolean
  unique: boolean
}

export function emptySchema(): Schema {
  const time = now()
  return {
    id: '',
    name: '',
    models: [],
    forkedFrom: null,
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
  return {
    id: shortid(),
    name: '',
    type: stringDataType(),
    primaryKey: false,
    required: false,
    unique: false,
  }
}

export function field(props: Partial<Field> = {}): Field {
  return {
    ...emptyField(),
    ...props,
  }
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
    foreignKey: null,
    alias: null,
  }
}

export function association(
  sourceModelId: Model['id'],
  targetModelId: Model['id'],
  props: Partial<Association>,
): Association {
  return { ...emptyAssociation(sourceModelId, targetModelId), ...props }
}

export function isNewSchema(schema: Schema): boolean {
  return schema.id === ''
}
