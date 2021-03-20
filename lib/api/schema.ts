import { Schema } from '@lib/core'
import shortid from 'shortid'

export async function listSchemas(): Promise<Schema[]> {
  return (await get<Schema[]>(schemasKey())) || []
}

export async function getSchema(id: string): Promise<Schema | undefined> {
  const schemas = await listSchemas()
  return schemas.find((s) => s.id === id)
}

export async function createSchema(schemaPayload: Omit<Schema, 'id'>): Promise<Schema> {
  const id = shortid()
  const schema: Schema = { id, ...schemaPayload }
  const schemas = await listSchemas()
  await set(schemasKey(), [...schemas, schema])
  return schema
}

export async function updateSchema(schema: Schema): Promise<Schema> {
  const schemas = await listSchemas()
  const updatedSchemas = schemas.map((s) => (s.id === schema.id ? schema : s))
  await set(schemasKey(), updatedSchemas)
  return schema
}

export async function deleteSchema(id: string): Promise<void> {
  const schemas = await listSchemas()
  const updatedSchemas = schemas.filter((s) => s.id !== id)
  await set(schemasKey(), updatedSchemas)
}

export async function clearSchemas(): Promise<void> {
  return await remove(schemasKey())
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
