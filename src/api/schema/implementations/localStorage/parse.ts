import { Schema } from '@src/core/schema'
import { Schema as JtdSchema, validate } from 'jtd'
import { SchemaV0 } from './v0'
import { SchemaV1 } from './v1'
import v1JtdSchema from './v1/schema.jtd.json'
import { fromV1, toV1 } from './v1/translate'

export function serializeSchema(schema: Schema): string {
  return JSON.stringify(toV1(schema))
}

type ParseSchemaResult = {
  schema: Schema
  migrated: boolean
}

export function parseSchema(schema: unknown): Promise<ParseSchemaResult> {
  return parseV1(schema)
    .then((schema) => ({ schema, migrated: false }))
    .catch(async () => ({ schema: await parseV0Lazy(schema), migrated: true }))
}

export async function parseV1(schema: unknown): Promise<Schema> {
  const errors = validate(v1JtdSchema as JtdSchema, schema)
  if (errors.length > 0) return await Promise.reject(errors)
  return fromV1(schema as SchemaV1)
}

/** Only fetch V0 schema if v1 parsing fails */
export async function parseV0Lazy(schema: unknown): Promise<Schema> {
  const [jtdSchema, fromV0] = await Promise.all([
    import('./v0/schema.jtd.json'),
    (await import('./v0/translate')).fromV0,
  ])
  const errors = validate(jtdSchema as JtdSchema, schema)
  if (errors.length > 0) return await Promise.reject(errors)
  return fromV0(schema as SchemaV0)
}
