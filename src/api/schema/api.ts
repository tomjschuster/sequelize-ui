import { Model, Schema } from '@src/core/schema'

export interface SchemaApi {
  listSchemas(): Promise<Schema[]>
  getSchema(id: string): Promise<Schema>
  createSchema(schemaPayload: Schema, fork?: boolean): Promise<Schema>
  updateSchema(schema: Schema): Promise<Schema>
  updateModel(model: Model, schema: Schema): Promise<Schema>
  deleteSchema(id: string): Promise<void>
}

export const SCHEMA_NOT_FOUND_ERROR = '[Schema Api Error] Schema not found'
