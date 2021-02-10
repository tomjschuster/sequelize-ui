import { DbConnection } from './connection'
import mysql, { Connection, ConnectionOptions, FieldPacket, RowDataPacket } from 'mysql2/promise'

export class MySqlConnection extends DbConnection {
  private static connectionOptions: ConnectionOptions = {
    user: process.env.MYSQL_DB_USER || 'root',
    password: process.env.MYSQL_DB_PASSWORD || 'root',
    port: parseInt(process.env.MYSQL_DB_PORT || '3306'),
    host: process.env.MYSQL_DB_USER_PORT || 'localhost',
  }

  constructor(database: string) {
    super()
    this.database = database
    this.connection = this.initializeConnection(database)
  }

  connected(): Promise<boolean> {
    return this.connection.then(() => true)
  }

  static async createDatabase(
    database: string,
    options = MySqlConnection.connectionOptions,
  ): Promise<void> {
    const connection = await mysql.createConnection(options)
    await connection.query(`DROP DATABASE IF EXISTS ${database};`)
    await connection.query(`CREATE DATABASE ${database};`)
    await connection.end()
  }

  static async dropDatabase(
    database: string,
    options = MySqlConnection.connectionOptions,
  ): Promise<void> {
    const connection = await mysql.createConnection(options)
    await connection.query(`DROP DATABASE IF EXISTS ${database};`)
    await connection.end()
    return
  }

  async getTables(): Promise<string[]> {
    const [rows] = await this.query<TablesResult>(MySqlConnection.tablesQuery(), [this.database])
    // information_schema columns are uppercase for MySQL, lowercase for MariaDB
    return rows.map((r) => r.table_name)
  }

  async getColumns(table: string): Promise<string[]> {
    const [rows] = await this.query<ColumnsResult>(MySqlConnection.columnsQuery(), [
      this.database,
      table,
    ])
    // information_schema columns are uppercase for MySQL, lowercase for MariaDB
    return rows.map((r) => r.column_name)
  }

  async close(): Promise<void> {
    const connection = await this.connection
    await connection.end()
    return
  }

  private static tablesQuery(): string {
    return `SELECT table_name as table_name FROM information_schema.tables where table_schema = ?;`
  }

  private static columnsQuery(): string {
    return `SELECT column_name as column_name FROM information_schema.columns WHERE table_schema = ? AND table_name = ?;`
  }

  private database: string
  private connection: Promise<Connection>

  private async initializeConnection(
    database: string,
    options = MySqlConnection.connectionOptions,
  ): Promise<Connection> {
    return mysql.createConnection({ ...options, database })
  }

  private async query<T extends RowDataPacket>(
    queryString: string,
    values: string[] = [],
  ): Promise<[T[], FieldPacket[]]> {
    const connection = await this.connection
    return connection.query<T[]>(queryString, values)
  }
}

interface TablesResult extends RowDataPacket {
  // information_schema columns are uppercase for MySQL, lowercase for MariaDB
  // TABLE_NAME: string
  table_name: string
}

interface ColumnsResult extends RowDataPacket {
  // information_schema columns are uppercase for MySQL, lowercase for MariaDB
  // COLUMN_NAME: string
  column_name: string
}
