import { DatabaseOptions } from '@src/core/database'
import { DirectoryItem } from '@src/core/files'
import { Schema } from '@src/core/schema'

export type GenerateArgs = {
  schema: Schema
  dbOptions: DatabaseOptions
}

export enum ProjectType {
  Npm = 'NPM',
}

export interface Framework {
  displayName(): string
  generate(args: GenerateArgs): DirectoryItem
  projectType(): ProjectType
}
