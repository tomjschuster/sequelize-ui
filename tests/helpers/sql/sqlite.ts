import { DbConnection } from './connection'
import { Database } from 'sqlite3'
import { deleteFileOrDirectory, mkdirp, tmpDirPath } from '../files'

export class SqlLiteConnection extends DbConnection {
  constructor(database: string) {
    super()
    this.db = this.initializeDb(database)
  }

  connected(): Promise<boolean> {
    return Promise.resolve(true)
  }

  static async createDatabase(database: string): Promise<void> {
    await SqlLiteConnection.dropDatabase(database)
    await mkdirp(tmpDirPath(database))
    const db = new Database(tmpDirPath(database, 'db'))
    return new Promise((resolve, reject) => db.close((err) => (err ? reject(err) : resolve())))
  }

  static async dropDatabase(database: string): Promise<void> {
    await deleteFileOrDirectory(tmpDirPath(database, 'db'))
    return Promise.resolve()
  }

  async getTables(): Promise<string[]> {
    const rows = await this.query<TablesResult>(SqlLiteConnection.tablesQuery())
    return rows.map((r) => r.name)
  }

  async getColumns(table: string): Promise<string[]> {
    const rows = await this.query<ColumnsResult>(SqlLiteConnection.columnsQuery(table))
    return rows.map((r) => r.name)
  }

  async close(): Promise<void> {
    const db = await this.db
    return new Promise((resolve, reject) => db.close((err) => (err ? reject(err) : resolve())))
  }

  private static tablesQuery(): string {
    return `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`
  }

  private static columnsQuery(table: string): string {
    return `PRAGMA table_info('${table}');`
  }

  private db: Promise<Database>

  private async initializeDb(database: string): Promise<Database> {
    await mkdirp(tmpDirPath(database))
    return new Database(tmpDirPath(database, 'db'))
  }

  private async query<T>(statement: string): Promise<T[]> {
    const db = await this.db
    return new Promise((resolve, reject) => {
      db.all(statement, (err, rows) => (err ? reject(err) : resolve(rows)))
    })
  }
}

type TablesResult = {
  name: string
}

type ColumnsResult = {
  name: string
}
