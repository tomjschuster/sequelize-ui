import { DatabaseOptions, DirectoryItem, Schema } from '@sequelize-ui/core'

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
