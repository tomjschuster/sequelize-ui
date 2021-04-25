import shortid from 'shortid'
import { Association, AssociationTypeType } from './association'
import { DataType, DataTypeType } from './dataType'

export type Schema = {
  id: string
  name: string
  models: Model[]
}

export type Model = {
  id: string
  name: string
  fields: Field[]
  associations: Association[]
}

export type Field = {
  id: string
  name: string
  type: DataType
  primaryKey?: boolean
  required?: boolean
  unique?: boolean
}

export function emptyModel(): Model {
  return { id: shortid(), name: '', fields: [], associations: [] }
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
