import { SchemaMeta } from '@src/api/meta'
import { DbOptions } from '@src/core/database'
import { FileSystemItem } from '@src/core/files/fileSystem'
import { Model, Schema } from '@src/core/schema'

export type GenerateArgs = {
  schema: Schema
  meta?: SchemaMeta
  dbOptions: DbOptions
}

export enum ProjectType {
  Npm = 'NPM',
}

export interface Framework {
  name: string
  displayName(): string
  generate(args: GenerateArgs): FileSystemItem
  projectType(): ProjectType
  defaultFile?(root: FileSystemItem): string | undefined
  defaultModelFile(model: Model, root: FileSystemItem): string | undefined
  modelFromPath(path: string, schema: Schema): Model | undefined
}
