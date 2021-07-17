import mysql, { Connection, ConnectionOptions, FieldPacket, RowDataPacket } from 'mysql2/promise'
import { DbConnection, DbConnectionConstructor } from './connection'

export const MySqlConnection: DbConnectionConstructor = class MySqlConnection
  implements DbConnection
{
  private static connectionOptions: ConnectionOptions = {
    user: process.env.MYSQL_DB_USER || 'root',
    password: process.env.MYSQL_DB_PASSWORD || 'root',
    port: parseInt(process.env.MYSQL_DB_PORT || '3306'),
    host: process.env.MYSQL_DB_PORT || 'localhost',
  }

  private database: string
  private connection: Promise<Connection>

  constructor(database: string) {
    this.database = database
    this.connection = MySqlConnection.connect(database)
  }

  connected(): Promise<boolean> {
    return this.connection.then(() => true)
  }

  async close(): Promise<void> {
    return MySqlConnection.close(await this.connection)
  }

  async getTables(): Promise<string[]> {
    // information_schema columns are uppercase for MySQL, lowercase for MariaDB
    const statement = `
      SELECT table_name as table_name
        FROM information_schema.tables
        WHERE table_schema = ?;
    `

    const [rows] = await this.query<TablesResult>(statement, [this.database])
    return rows.map((r) => r.table_name)
  }

  async getColumns(table: string): Promise<string[]> {
    // information_schema columns are uppercase for MySQL, lowercase for MariaDB
    const statement = `
      SELECT column_name as column_name
        FROM information_schema.columns
        WHERE table_schema = ? AND table_name = ?;
    `

    const [rows] = await this.query<ColumnsResult>(statement, [this.database, table])
    return rows.map((r) => r.column_name)
  }

  static async createDatabase(database: string): Promise<void> {
    const connection = await MySqlConnection.connect()
    await MySqlConnection.query(connection, `DROP DATABASE IF EXISTS ${database};`)
    await MySqlConnection.query(connection, `CREATE DATABASE ${database};`)
    await connection.end()
  }

  static async dropDatabase(database: string): Promise<void> {
    const connection = await MySqlConnection.connect()
    await connection.query(`DROP DATABASE IF EXISTS ${database};`)
    await connection.end()
    return
  }

  private async query<T extends RowDataPacket>(
    queryString: string,
    values: string[] = [],
  ): Promise<[T[], FieldPacket[]]> {
    const connection = await this.connection
    return MySqlConnection.query<T>(connection, queryString, values)
  }

  private static connect(database?: string): Promise<Connection> {
    return mysql.createConnection({
      ...MySqlConnection.connectionOptions,
      database,
    })
  }

  private static close(connection: Connection): Promise<void> {
    return connection.end()
  }

  private static async query<T extends RowDataPacket>(
    connection: Connection,
    statement: string,
    values: string[] = [],
  ): Promise<[T[], FieldPacket[]]> {
    return connection.query<T[]>(statement, values)
  }
}

interface TablesResult extends RowDataPacket {
  table_name: string
}

interface ColumnsResult extends RowDataPacket {
  column_name: string
}
