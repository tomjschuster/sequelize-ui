import { DbOptions } from '@src/core/database'
import { Field, Model, Schema } from '@src/core/schema'
import { idField, prefixPk } from './field'

type NormalizeSchemaArgs = {
  schema: Schema
  dbOptions: DbOptions
}
export const normalizeSchema = ({ schema, dbOptions }: NormalizeSchemaArgs): Schema => {
  return { ...schema, models: schema.models.map((model) => normalizeModel({ model, dbOptions })) }
}

type NormalizeModelArgs = {
  model: Model
  dbOptions: DbOptions
}
const normalizeModel = ({ model, dbOptions }: NormalizeModelArgs): Model => {
  return { ...model, fields: getFieldsWithPk({ model, dbOptions }) }
}

type GetFieldsWithIdArgs = {
  model: Model
  dbOptions: DbOptions
}
function getFieldsWithPk({ model, dbOptions }: GetFieldsWithIdArgs): Field[] {
  const pks = model.fields.filter((f) => f.primaryKey)

  // Don't apply any prefixes if pk is composite
  if (pks.length > 1) return model.fields
  // Add explicit pk field for TypeScript classes
  if (pks.length === 0) return [idField({ model, dbOptions }), ...model.fields]
  // Prefix pk with model name if pk is standard  format and prefixPk option is true
  return model.fields.map((field) => prefixPk({ field, model, dbOptions }))
}
