export abstract class DbClient {
  constructor(public database: string) {}
  abstract getTables(): Promise<string[]>
  abstract getColumns(table: string): Promise<string[]>
  abstract close(): Promise<void>
}
