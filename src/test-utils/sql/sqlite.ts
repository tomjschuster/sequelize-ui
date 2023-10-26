import { ProjectType } from '@src/core/framework'
import { deleteFileOrDirectory, exists, mkdirp, tmpDirPath } from '@src/test-utils/files'
import { isLinux } from 'check-os'
import { Database } from 'sqlite3'
import { DbConnection, DbConnectionConstructor } from './connection'

const sqlitePaths = ['/usr/bin/sqlite3', '/usr/local/bin/sqlite3']

export const SqlLiteConnection: DbConnectionConstructor = class SqlLiteConnection
  implements DbConnection
{
  static preinstall(projectType: ProjectType): string | undefined {
    // sqlite3 takes a long time to install on linux:
    // sudo apt-get install libsqlite3-dev
    return projectType === ProjectType.Npm && isLinux && sqlitePaths.some(exists)
      ? 'npm install sqlite3 --build-from-source --sqlite=/usr'
      : undefined
  }

  constructor(database: string) {
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

  static async createDatabase(database: string): Promise<void> {
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
      db.all(statement, (err, rows) => (err ? reject(err) : resolve(rows as T[])))
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
