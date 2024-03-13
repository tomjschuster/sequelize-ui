import {
  Association,
  AssociationTypeType,
  Model,
  Schema,
  ThroughType,
  manyToManyTableType,
} from '@src/core/schema'
import { arrayToLookup } from '@src/utils/array'
import { now } from '@src/utils/dateTime'
import { get, lsKey, remove, set } from '@src/utils/localStorage'
import { uniqueId, versionedName } from '@src/utils/string'
import { Schema as JtdSchema, validate } from 'jtd'
import { SCHEMA_NOT_FOUND_ERROR, SchemaApi } from '../../api'
import * as Ids from '../../examples/ids'
import { SchemaV0 } from './v0'
import { SchemaV1 } from './v1'
import v1JtdSchema from './v1/schema.jtd.json'
import { fromV1, toV1 } from './v1/translate'

export default class LocalStorageSchemaApi implements SchemaApi {
  async listSchemas(): Promise<Schema[]> {
    await migrateLegacy()
    return await getSchemas()
  }

  async getSchema(id: string): Promise<Schema> {
    const exampleSchema = await getExampleSchema(id)

    if (exampleSchema) return exampleSchema

    const schemas = await getSchemas()
    const schema = schemas.find((s) => s.id === id)
    return schema || Promise.reject(new Error(SCHEMA_NOT_FOUND_ERROR))
  }

  async createSchema(schemaPayload: Schema, fork?: boolean): Promise<Schema> {
    const schemas = await getSchemas()
    const name = versionedName(
      schemaPayload.name,
      schemas.map((s) => s.name),
    )
    const id = uniqueId()
    const time = now()
    const models = schemaPayload.models.map((m) => ({ ...m, createdAt: time, updatedAt: time }))
    const forkedFrom = fork ? schemaPayload.id : null

    const schema: Schema = {
      ...schemaPayload,
      id,
      forkedFrom,
      name,
      createdAt: time,
      updatedAt: time,
      models,
    }

    await setSchemas([...schemas, schema])
    return schema
  }

  async updateSchema(schema: Schema): Promise<Schema> {
    const schemas = await getSchemas()
    const existingSchema = schemas.find((s) => s.id === schema.id)

    if (!existingSchema) {
      return Promise.reject(new Error(SCHEMA_NOT_FOUND_ERROR))
    }

    const updatedSchema: Schema = removeTargetingAssociations(existingSchema, schema)
    const updatedSchemas = schemas.map((s) =>
      s.id === schema.id ? { ...updatedSchema, updatedAt: now() } : s,
    )

    await setSchemas(updatedSchemas)
    return updatedSchema
  }

  async updateModel(model: Model, schema: Schema): Promise<Schema> {
    const newSchema = {
      ...schema,
      models: schema.models.map((m) => (m.id === model.id ? model : m)),
    }
    return await updateSchema(newSchema)
  }

  async deleteSchema(id: string): Promise<void> {
    const schemas = await getSchemas()
    if (schemas.length) {
      const updatedSchemas = schemas.filter((s) => s.id !== id)
      await setSchemas(updatedSchemas)
    }
  }

  async deleteAllSchemas(): Promise<void> {
    remove(schemasKey())
  }
}

export async function listSchemas(): Promise<Schema[]> {
  await migrateLegacy()
  return await getSchemas()
}

export async function getSchema(id: string): Promise<Schema> {
  const exampleSchema = await getExampleSchema(id)

  if (exampleSchema) return exampleSchema

  const schemas = await getSchemas()
  const schema = schemas.find((s) => s.id === id)
  return schema || Promise.reject(new Error(SCHEMA_NOT_FOUND_ERROR))
}

export async function createSchema(schemaPayload: Schema, fork?: boolean): Promise<Schema> {
  const schemas = await getSchemas()
  const name = versionedName(
    schemaPayload.name,
    schemas.map((s) => s.name),
  )
  const id = uniqueId()
  const time = now()
  const models = schemaPayload.models.map((m) => ({ ...m, createdAt: time, updatedAt: time }))
  const forkedFrom = fork ? schemaPayload.id : null

  const schema: Schema = {
    ...schemaPayload,
    id,
    forkedFrom,
    name,
    createdAt: time,
    updatedAt: time,
    models,
  }

  await setSchemas([...schemas, schema])
  return schema
}

export async function updateSchema(schema: Schema): Promise<Schema> {
  const schemas = await getSchemas()
  const existingSchema = schemas.find((s) => s.id === schema.id)

  if (!existingSchema) {
    return Promise.reject(new Error(SCHEMA_NOT_FOUND_ERROR))
  }

  const updatedSchema: Schema = removeTargetingAssociations(existingSchema, schema)
  const updatedSchemas = schemas.map((s) =>
    s.id === schema.id ? { ...updatedSchema, updatedAt: now() } : s,
  )

  await setSchemas(updatedSchemas)
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
  const schemas = await getSchemas()
  if (schemas.length) {
    const updatedSchemas = schemas.filter((s) => s.id !== id)
    await setSchemas(updatedSchemas)
  }
}

function schemasKey(): string {
  return lsKey('schemas')
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
    type: manyToManyTableType(`${nameA} ${nameB}`),
  }
}

async function getExampleSchema(id: string): Promise<Schema | null> {
  switch (id) {
    case Ids.BLOG_ID:
      return (await import('../../examples/blog')).default
    case Ids.EMPLOYEES_ID:
      return (await import('../../examples/employees')).default
    case Ids.SAKILA_ID:
      return (await import('../../examples/sakila')).default
    case Ids.STUDENT_INFO_SYSTEM_ID:
      return (await import('../../examples/studentInfoSystem')).default
    default:
      return await Promise.resolve(null)
  }
}

async function migrateLegacy(): Promise<void> {
  try {
    if (await hasMigratedLegacy()) return

    const legacySchema = get('SUI_STATE')

    if (legacySchema) {
      const schema = await parseV0Lazy(legacySchema)
      await createSchema(schema)
      return await setHasMigratedLegacy()
    }
  } catch (e) {
    console.error(e)
  }
}

const MIGRATED_FROM_LEGACY_KEY = 'migrated-from-legacy'

async function hasMigratedLegacy(): Promise<boolean> {
  return get(lsKey(MIGRATED_FROM_LEGACY_KEY)) === true
}

async function setHasMigratedLegacy(): Promise<void> {
  return set(lsKey(MIGRATED_FROM_LEGACY_KEY), true)
}

async function setSchemas(schemas: Schema[]): Promise<void> {
  return set(schemasKey(), schemas.map(toV1))
}

async function getSchemas(): Promise<Schema[]> {
  const data = get(schemasKey()) || []
  if (Array.isArray(data)) {
    const schemaResults = await Promise.all(data.map(parseSchema))
    const schemas = schemaResults.map((result) => result.schema)

    if (schemaResults.some((result) => result.migrated)) {
      await setSchemas(schemas)
    }

    return schemas
  }

  return Promise.reject(new Error(`Invalid Schema: ${typeof data}`))
}

type ParseSchemaResult = {
  schema: Schema
  migrated: boolean
}

function parseSchema(schema: unknown): Promise<ParseSchemaResult> {
  return parseV1(schema).then((schema) => ({ schema, migrated: false }))
}

async function parseV1(schema: unknown): Promise<Schema> {
  const errors = validate(v1JtdSchema as JtdSchema, schema)
  if (errors.length > 0) return await Promise.reject(errors)
  return fromV1(schema as SchemaV1)
}

/** Only fetch V0 schema if v1 parsing fails */
async function parseV0Lazy(schema: unknown): Promise<Schema> {
  const [jtdSchema, fromV0] = await Promise.all([
    import('./v0/schema.jtd.json'),
    (await import('./v0/translate')).fromV0,
  ])
  const errors = validate(jtdSchema as JtdSchema, schema)
  if (errors.length > 0) return await Promise.reject(errors)
  return fromV0(schema as SchemaV0)
}
