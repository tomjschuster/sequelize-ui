import { DbConnection } from './connection'
import { Database } from 'sqlite3'
import { deleteFileOrDirectory, exists, mkdirp, tmpDirPath } from '../files'

export class SqlLiteConnection extends DbConnection {
  static preinstall(): string {
    // sudo apt-get install libsqlite3-dev
    return 'npm install sqlite3 --build-from-source --sqlite=/usr'
  }

  constructor(database: string) {
    super()
    this.database = database
    SqlLiteConnection.createDatabase(database)
  }

  private database: string

  connected(): Promise<boolean> {
    return exists(tmpDirPath(this.database, '.tmp'))
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

  close(): Promise<void> {
    return Promise.resolve()
  }

  static createDatabase(database: string): Promise<void> {
    return mkdirp(tmpDirPath(database, '.tmp'))
  }

  static dropDatabase(database: string): Promise<void> {
    return deleteFileOrDirectory(tmpDirPath(database, '.tmp', 'data.db'))
  }

  private async query<T>(statement: string): Promise<T[]> {
    return SqlLiteConnection.query(await this.database, statement)
  }

  private static async connect(database: string): Promise<Database> {
    return new Promise((resolve, reject) => {
      const db: Database = new Database(tmpDirPath(database, '.tmp', 'data.db'), (err) =>
        err ? reject(err) : resolve(db),
      )
    })
  }

  private static close(db: Database): Promise<void> {
    return new Promise((resolve, reject) => db.close((err) => (err ? reject(err) : resolve())))
  }

  private static async query<T>(database: string, statement: string): Promise<T[]> {
    const db = await SqlLiteConnection.connect(database)

    const rows: Promise<T[]> = new Promise((resolve, reject) => {
      db.all(statement, (err, rows) => (err ? reject(err) : resolve(rows)))
    })

    await SqlLiteConnection.close(db)

    return rows
  }
}

type TablesResult = {
  name: string
}

type ColumnsResult = {
  name: string
}
