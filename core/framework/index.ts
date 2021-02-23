import { DatabaseOptions } from '@sequelize-ui/core/database'
import { DirectoryItem } from '@sequelize-ui/core/files'
import { Schema } from '@sequelize-ui/core/schema'

type GenerateArgs = {
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
