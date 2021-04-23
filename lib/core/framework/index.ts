import { DatabaseOptions } from '@lib/core/database'
import { DirectoryItem } from '@lib/core/files'
import { Schema } from '@lib/core/schema'

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
