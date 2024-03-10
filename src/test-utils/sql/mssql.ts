import { Connection, ConnectionConfiguration, Request } from 'tedious'
import { ColumnMetadata } from 'tedious/lib/token/colmetadata-token-parser'
import { DbConnection, DbConnectionConstructor } from './connection'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Result = { [key: string]: any }

export const MsSqlConnection: DbConnectionConstructor = class MsSqlConnection
  implements DbConnection
{
  private static connectionConfig: ConnectionConfiguration = {
    server: process.env.MSSQL_DB_HOST || '127.0.0.1',
    options: {
      port: parseInt(process.env.MSSQL_DB_PORT || '1433'),
      encrypt: false,
      trustServerCertificate: true,
    },
    authentication: {
      type: 'default',
      options: {
        userName: process.env.MSSQL_DB_USER || 'sa',
        password: process.env.MSSQL_DB_PASSWORD || 'Password1',
      },
    },
  }

  private connection: Promise<Connection>

  constructor(database: string) {
    this.connection = MsSqlConnection.connect(database)
  }

  connected(): Promise<boolean> {
    return this.connection.then(() => true)
  }

  async getTables(): Promise<string[]> {
    const statement = `SELECT table_name FROM information_schema.tables`
    const rows = await this.query<TablesResult>(statement)
    return rows.map((r) => r.table_name)
  }

  async getColumns(table: string): Promise<string[]> {
    const statement = `SELECT column_name FROM information_schema.columns WHERE table_name = '${table}';`
    const rows = await this.query<ColumnsResult>(statement)
    return rows.map((r) => r.column_name)
  }

  async close(): Promise<void> {
    const connection = await this.connection
    return MsSqlConnection.closeConnection(connection)
  }

  static async createDatabase(database: string): Promise<void> {
    const connection = await MsSqlConnection.connect()
    await MsSqlConnection.query(connection, `DROP DATABASE IF EXISTS ${database};`)
    await MsSqlConnection.query(connection, `CREATE DATABASE ${database};`)
    return MsSqlConnection.closeConnection(connection)
  }

  static async dropDatabase(database: string): Promise<void> {
    const connection = await MsSqlConnection.connect()
    await MsSqlConnection.query(connection, `DROP DATABASE IF EXISTS ${database};`)
    return MsSqlConnection.closeConnection(connection)
  }

  private async query<T extends Result>(statement: string): Promise<T[]> {
    const connection = await this.connection
    return MsSqlConnection.query<T>(connection, statement)
  }

  private static connect(database?: string): Promise<Connection> {
    const { connectionConfig } = MsSqlConnection

    const connection = new Connection({
      ...connectionConfig,
      options: { ...connectionConfig.options, database },
    })

    return new Promise<Connection>((resolve, reject) =>
      connection.connect((err) => (err ? reject(err) : resolve(connection))),
    )
  }

  private static closeConnection(connection: Connection): Promise<void> {
    return new Promise<void>((resolve) => {
      connection.on('end', resolve)
      connection.close()
    })
  }

  private static query<T extends Result>(connection: Connection, statement: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const rows: T[] = []
      const request = new Request(statement, (err) => (err ? reject(err) : resolve(rows)))
      request.on('row', (row: ColumnValue<T>[]) => rows.push(MsSqlConnection.transformRow<T>(row)))
      connection.execSql(request)
    })
  }

  private static transformRow<T extends Result>(row: ColumnValue<T>[]): T {
    return row.reduce<T>(
      (acc, { value, metadata: { colName } }) => ({ ...acc, [colName]: value }),
      {} as T,
    )
  }
}

type ColumnValue<T extends Result> = {
  metadata: ColumnMetadata
  value: T[keyof T]
}

interface TablesResult {
  table_name: string
}

interface ColumnsResult {
  column_name: string
}
