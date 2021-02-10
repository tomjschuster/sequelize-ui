import { ColumnValue, Connection, ConnectionConfig, Request } from 'tedious'
import { DbConnection } from './connection'

export class MsSqlConnection extends DbConnection {
  private static connectionConfig: ConnectionConfig = {
    server: process.env.MSSQL_DB_HOST || '127.0.0.1',
    options: {
      port: parseInt(process.env.MSSQL_DB_PORT || '1433'),
      encrypt: false,
    },
    authentication: {
      type: 'default',
      options: {
        userName: process.env.MSSQL_DB_USER || 'sa',
        password: process.env.MSSQL_DB_PASSWORD || 'Password1',
      },
    },
  }

  constructor(database: string) {
    super()
    this.connection = MsSqlConnection.connect(database)
  }

  connected(): Promise<boolean> {
    return this.connection.then(() => true)
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

  async getTables(): Promise<string[]> {
    const rows = await this.query<TablesResult>(MsSqlConnection.tablesQuery())
    return rows.map((r) => r.table_name)
  }

  async getColumns(table: string): Promise<string[]> {
    const rows = await this.query<ColumnsResult>(MsSqlConnection.columnsQuery(table))
    return rows.map((r) => r.column_name)
  }

  async close(): Promise<void> {
    const connection = await this.connection
    return MsSqlConnection.closeConnection(connection)
  }

  private static tablesQuery(): string {
    return `SELECT table_name FROM information_schema.tables`
  }

  private static columnsQuery(table: string): string {
    return `SELECT column_name FROM information_schema.columns WHERE table_name = '${table}';`
  }

  private connection: Promise<Connection>

  private static connect(database?: string): Promise<Connection> {
    const { connectionConfig } = MsSqlConnection

    const connection = new Connection({
      ...connectionConfig,
      options: { ...connectionConfig.options, database },
    })

    return new Promise<Connection>((resolve, reject) => {
      connection.on('error', reject)
      connection.connect((err) => {
        if (err) {
          reject(err)
        } else {
          resolve(connection)
        }
      })
    })
  }

  private static query<T>(connection: Connection, statement: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const rows: T[] = []
      const request = new Request(statement, (err, _rowCount) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })

      request.on('row', (row: ColumnValue[]) => {
        const value = row.reduce(
          (acc, { value, metadata: { colName } }) => ({ ...acc, [colName]: value }),
          {},
        )
        rows.push(value as T)
      })

      connection.execSql(request)
    })
  }

  private static closeConnection(connection: Connection): Promise<void> {
    return new Promise<void>((resolve) => {
      connection.on('end', resolve)
      connection.close()
    })
  }

  private async query<T>(query: string): Promise<T[]> {
    const connection = await this.connection
    return MsSqlConnection.query<T>(connection, query)
  }
}

interface TablesResult {
  table_name: string
}

interface ColumnsResult {
  column_name: string
}
