import {
  Association,
  AssociationTypeType,
  DataTypeType,
  Field,
  Model,
  Schema,
} from '@src/core/schema'
import { versionedName } from '@src/core/utils/string'
import shortid from 'shortid'

export const SCHEMA_NOT_FOUND_ERROR = '[Schema Api Error] Schema not found'

export async function listSchemas(): Promise<Schema[]> {
  return (await get<Schema[]>(schemasKey())) || []
}

export async function getSchema(id: string): Promise<Schema> {
  const schemas = await listSchemas()
  const schema = schemas.find((s) => s.id === id)
  return schema || Promise.reject(new Error(SCHEMA_NOT_FOUND_ERROR))
}

export async function createSchema(schemaPayload: Omit<Schema, 'id'>): Promise<Schema> {
  const schemas = await listSchemas()
  const name = versionedName(
    schemaPayload.name,
    schemas.map((s) => s.name),
  )
  const id = shortid()
  const schema: Schema = { ...schemaPayload, id, name }
  await set(schemasKey(), [...schemas, schema])
  return schema
}

export async function updateSchema(schema: Schema): Promise<Schema> {
  const schemas = await listSchemas()

  if (!schemas.some((s) => s.id === schema.id)) {
    return Promise.reject(new Error(SCHEMA_NOT_FOUND_ERROR))
  }

  const updatedSchemas = schemas.map((s) => (s.id === schema.id ? schema : s))
  await set(schemasKey(), updatedSchemas)
  return schema
}

export async function deleteSchema(id: string): Promise<void> {
  const schemas = await listSchemas()
  if (schemas.length) {
    const updatedSchemas = schemas.filter((s) => s.id !== id)
    await set(schemasKey(), updatedSchemas)
  }
}

export async function clearSchemas(): Promise<void> {
  return await remove(schemasKey())
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

function get<T>(key: string): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    try {
      const item: string | null = localStorage.getItem(lsKey(key))
      if (item === null) return resolve(item)
      const result: T = JSON.parse(item)
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

function set<T>(key: string, value: T): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const payload = JSON.stringify(value)
      localStorage.setItem(lsKey(key), payload)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

function remove(key: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      localStorage.removeItem(lsKey(key))
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

function schemasKey(): string {
  return '/schemas'
}

const NAMESPACE = `__SEQUELIZEUI__`
function lsKey(key: string): string {
  return NAMESPACE + key
}
