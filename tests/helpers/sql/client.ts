export interface DbClient {
  connected: () => Promise<boolean>
  getTables: () => Promise<string[]>
  getColumns: (table: string) => Promise<string[]>
  close: () => Promise<void>
}

export interface DbClientConstructor {
  new (database: string): DbClient
  createDatabase(database: string): Promise<void>
  dropDatabase(database: string): Promise<void>
}
