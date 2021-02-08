export abstract class DbClient {
  abstract connected: Promise<boolean>
  abstract getTables(): Promise<string[]>
  abstract getColumns(table: string): Promise<string[]>
  abstract close(): Promise<void>
}

export interface DbClientConstructor {
  new (database: string): DbClient
  createDatabase(database: string): Promise<void>
  dropDatabase(database: string): Promise<void>
}
