import { Association, AssociationTypeType, Model, Schema, ThroughType } from '@src/core/schema'
import { arrayToLookup } from '@src/utils/array'
import { now } from '@src/utils/dateTime'
import { versionedName } from '@src/utils/string'
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

export async function createSchema(schemaPayload: Schema, fork?: boolean): Promise<Schema> {
  const schemas = await listSchemas()
  const name = versionedName(
    schemaPayload.name,
    schemas.map((s) => s.name),
  )
  const id = shortid()
  const time = now()
  const models = schemaPayload.models.map((m) => ({ ...m, createdAt: time, updatedAt: time }))
  const forkedFrom = fork ? schemaPayload.id : undefined

  const schema: Schema = {
    ...schemaPayload,
    id,
    forkedFrom,
    name,
    createdAt: time,
    updatedAt: time,
    models,
  }

  await set(schemasKey(), [...schemas, schema])
  return schema
}

export async function updateSchema(schema: Schema): Promise<Schema> {
  const schemas = await listSchemas()
  const existingSchema = schemas.find((s) => s.id === schema.id)

  if (!existingSchema) {
    return Promise.reject(new Error(SCHEMA_NOT_FOUND_ERROR))
  }

  const updatedSchema: Schema = removeTargetingAssociations(existingSchema, schema)
  const updatedSchemas = schemas.map((s) =>
    s.id === schema.id ? { ...updatedSchema, updatedAt: now() } : s,
  )

  await set(schemasKey(), updatedSchemas)
  return updatedSchema
}

export async function updateModel(model: Model, schema: Schema): Promise<Schema> {
  const newSchema = { ...schema, models: schema.models.map((m) => (m.id === model.id ? model : m)) }
  return await updateSchema(newSchema)
}

function removeTargetingAssociations(schema: Schema, updatedSchema: Schema): Schema {
  const modelById = arrayToLookup(updatedSchema.models, (m) => m.id)
  const removedModels = schema.models.filter((m) => !modelById.get(m.id))

  const models = updatedSchema.models.map((m) => ({
    ...m,
    associations: m.associations
      .filter((a) => !removedModels.some((m) => m.id === a.targetModelId))
      .map((association) => joinModelToTable(association, removedModels, modelById)),
  }))

  return { ...updatedSchema, models }
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

export async function clearData(): Promise<void> {
  return await Promise.all([clearSchemas()]).then()
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

export const NAMESPACE = `__SEQUELIZEUI__`
function lsKey(key: string): string {
  return NAMESPACE + key
}

function joinModelToTable(
  association: Association,
  removedModels: Model[],
  modelById: Map<string, Model>,
): Association {
  if (association.type.type !== AssociationTypeType.ManyToMany) return association

  const throughModelId =
    association.type.through.type === ThroughType.ThroughModel
      ? association.type.through.modelId
      : /* istanbul ignore next */
        undefined

  const through = removedModels.find((model) => model.id === throughModelId)
  const source = modelById.get(association.sourceModelId)
  const target = modelById.get(association.targetModelId)

  if (!through || !source || !target) return association

  const [nameA, nameB] = [source.name, target.name].sort((a, b) => a.localeCompare(b))

  return {
    ...association,
    type: {
      ...association.type,
      through: { type: ThroughType.ThroughTable, table: `${nameA} ${nameB}` },
    },
  }
}
