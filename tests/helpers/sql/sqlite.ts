import { DbConnection } from './connection'
import { Database } from 'sqlite3'
import { deleteFileOrDirectory, mkdirp, tmpDirPath } from '../files'

export class SqlLiteConnection extends DbConnection {
  constructor(database: string) {
    super()
    this.db = SqlLiteConnection.createDb(database)
  }

  private db: Promise<Database>

  connected(): Promise<boolean> {
    return this.db.then(() => true)
  }

  async getTables(): Promise<string[]> {
    const statement = `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`
    const rows = await this.query<TablesResult>(statement)
    return rows.map((r) => r.name)
  }

  async getColumns(table: string): Promise<string[]> {
    const statement = `PRAGMA table_info('${table}');`
    const rows = await this.query<ColumnsResult>(statement)
    return rows.map((r) => r.name)
  }

  async close(): Promise<void> {
    return SqlLiteConnection.close(await this.db)
  }

  static async createDatabase(database: string): Promise<void> {
    await SqlLiteConnection.dropDatabase(database)
    await SqlLiteConnection.createDb(database)
  }

  static async dropDatabase(database: string): Promise<void> {
    await deleteFileOrDirectory(tmpDirPath(database, 'db'))
  }

  private async query<T>(statement: string): Promise<T[]> {
    return SqlLiteConnection.query(await this.db, statement)
  }

  private static async createDb(database: string): Promise<Database> {
    await mkdirp(tmpDirPath(database))
    return new Database(tmpDirPath(database, 'db'))
  }

  private static async close(db: Database): Promise<void> {
    return new Promise((resolve, reject) => db.close((err) => (err ? reject(err) : resolve())))
  }

  private static async query<T>(db: Database, statement: string): Promise<T[]> {
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
