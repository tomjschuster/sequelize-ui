import { Association } from './association'
import { DataType } from './dataType'

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
