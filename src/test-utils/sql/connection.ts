import { ProjectType } from '@src/core/framework'

export interface DbConnection {
  connected(): Promise<boolean>
  getTables(): Promise<string[]>
  getColumns(table: string): Promise<string[]>
  close(): Promise<void>
}

export interface DbConnectionConstructor {
  new (database: string): DbConnection
  createDatabase(database: string): Promise<void>
  dropDatabase(database: string): Promise<void>
  preinstall?(projectType: ProjectType): string | undefined
}
