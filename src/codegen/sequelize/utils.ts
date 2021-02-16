import { pascalCase, singular } from '../../helpers/string'
import { DataTypeType, Field, Model } from '../../schema'

export const modelName = ({ name }: Model): string => singular(pascalCase(name))

export const addIdField = (fields: Field[]): Field[] =>
  fields.some((f) => f.primaryKey) ? fields : [idField(), ...fields]

const idField = (): Field => ({
  name: 'id',
  type: { type: DataTypeType.Integer },
  primaryKey: true,
})

export const hasJsonType = (model: Model): boolean =>
  model.fields.some((f) => f.type.type === DataTypeType.Json)
