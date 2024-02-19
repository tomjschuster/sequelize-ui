import { now } from '@src/utils/dateTime'
import { uniqueId } from '@src/utils/string'
import { AtLeast } from '@src/utils/types'
import { stringDataType } from '.'
import { Association, AssociationType, belongsToType } from './association'
import { DataType } from './dataType'

export type Schema = {
  id: string
  name: string
  models: Model[]
  forkedFrom: string | null
  createdAt: string
  updatedAt: string
  // TODO: remove after switching to use constructor everywhere
  __throwaway__: false
}

export type Model = {
  id: string
  name: string
  fields: Field[]
  associations: Association[]
  createdAt: string
  updatedAt: string
  // TODO: remove after switching to use constructor everywhere
  __throwaway__: false
}

export type Field = {
  id: string
  name: string
  type: DataType
  primaryKey: boolean
  required: boolean
  unique: boolean
  // TODO: remove after switching to use constructor everywhere
  __throwaway__: false
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
    // TODO: remove after switching to use constructor everywhere
    __throwaway__: false,
  }
}

export function schema(attrs: AtLeast<Schema, 'name'>): Schema {
  return { ...emptySchema(), ...attrs }
}

export function emptyModel(): Model {
  const time = now()
  return {
    id: uniqueId(),
    name: '',
    fields: [],
    associations: [],
    createdAt: time,
    updatedAt: time,
    // TODO: remove after switching to use constructor everywhere
    __throwaway__: false,
  }
}

export function model(attrs: AtLeast<Model, 'name'>): Model {
  return { ...emptyModel(), ...attrs }
}

export function emptyField(): Field {
  return {
    id: uniqueId(),
    name: '',
    type: stringDataType(),
    primaryKey: false,
    required: false,
    unique: false,
    __throwaway__: false,
  }
}

export function field(props: AtLeast<Field, 'name' | 'type'>): Field {
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
    id: uniqueId(),
    sourceModelId,
    type: belongsToType(),
    targetModelId,
    foreignKey: null,
    alias: null,
    __throwaway__: false,
  }
}

export function association<T extends AssociationType>(
  props: AtLeast<Association<T>, 'sourceModelId' | 'targetModelId' | 'type'>,
): Association<T> {
  return { ...emptyAssociation(props.sourceModelId, props.targetModelId), ...props }
}

export function isNewSchema(schema: Schema): boolean {
  return schema.id === ''
}
