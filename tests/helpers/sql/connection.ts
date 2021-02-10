export abstract class DbConnection {
  abstract connected(): Promise<boolean>
  abstract getTables(): Promise<string[]>
  abstract getColumns(table: string): Promise<string[]>
  abstract close(): Promise<void>
}

export interface DbConnectionConstructor {
  new (database: string): DbConnection
  createDatabase(database: string): Promise<void>
  dropDatabase(database: string): Promise<void>
}
