import { DbOptions } from '@src/core/database'
import { DirectoryItem } from '@src/core/files'
import { Model, Schema } from '@src/core/schema'

export type GenerateArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export enum ProjectType {
  Npm = 'NPM',
}

export interface Framework {
  displayName(): string
  generate(args: GenerateArgs): DirectoryItem
  projectType(): ProjectType
  defaultFile?(root: DirectoryItem): string | undefined
  defaultModelFile?(model: Model, root: DirectoryItem): string | undefined
  modelFromPath?(path: string, schema: Schema): Model | undefined
}
