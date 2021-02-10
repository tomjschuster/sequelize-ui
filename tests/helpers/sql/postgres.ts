import { DbConnection } from './connection'
import { Client, ClientConfig, QueryResult } from 'pg'

export class PostgresConnection extends DbConnection {
  private static clientConfig: ClientConfig = {
    user: process.env.POSTGRES_DB_USER || 'postgres',
    password: process.env.POSTGRES_DB_PASSWORD || 'postgres',
    port: parseInt(process.env.POSTGRES_DB_PORT || '5432'),
    host: process.env.POSTGRES_DB_USER_PORT || 'localhost',
  }

  constructor(database: string) {
    super()
    this.client = this.initializeClient(database)
  }

  connected(): Promise<boolean> {
    return this.client.then(() => true)
  }

  static async createDatabase(database: string): Promise<void> {
    const client = new Client(PostgresConnection.clientConfig)

    await client.connect()
    await client.query(`DROP DATABASE IF EXISTS ${database};`)
    await client.query(`CREATE DATABASE ${database};`)
    await client.end()
  }

  static async dropDatabase(database: string): Promise<void> {
    const client = new Client(PostgresConnection.clientConfig)

    await client.connect()
    await client.query(`DROP DATABASE IF EXISTS ${database};`)
    await client.end()
    return
  }

  async getTables(): Promise<string[]> {
    const result = await this.query<TablesResult>(PostgresConnection.tablesQuery())
    return result.rows.map((r) => r.table_name)
  }

  async getColumns(table: string): Promise<string[]> {
    const result = await this.query<ColumnsResult>(PostgresConnection.columnsQuery(table))
    return result.rows.map((r) => r.column_name)
  }

  async close(): Promise<void> {
    const client = await this.client
    await client.end()
    return
  }

  private static tablesQuery(): string {
    return `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
  }

  private static columnsQuery(table: string): string {
    return `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}';`
  }

  private client: Promise<Client>

  private async initializeClient(database: string): Promise<Client> {
    const client = new Client({ ...PostgresConnection.clientConfig, database })
    await client.connect()
    return client
  }

  private async query<T>(queryString: string): Promise<QueryResult<T>> {
    const client = await this.client
    return client.query<T>(queryString)
  }
}

type TablesResult = {
  table_name: string
}

type ColumnsResult = {
  column_name: string
}
