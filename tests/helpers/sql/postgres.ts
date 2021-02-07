import { DbClient } from './client'
import { Client, QueryResult } from 'pg'

export class PostgresClient extends DbClient {
  constructor(database: string) {
    super(database)
    this.client = this.initializeClient(database)
  }

  async getTables(): Promise<string[]> {
    const result = await this.query<TablesResult>(PostgresClient.tablesQuery())
    return result.rows.map((r) => r.table_name)
  }

  async getColumns(table: string): Promise<string[]> {
    const result = await this.query<ColumnsResult>(PostgresClient.columnsQuery(table))
    return result.rows.map((r) => r.column_name)
  }

  async close(): Promise<void> {
    const client = await this.client
    return client.end()
  }

  private static tablesQuery(): string {
    return `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
  }

  private static columnsQuery(table: string): string {
    return `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}';`
  }

  private static COLUMNS_E = `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
  private client: Promise<Client>

  private async initializeClient(database: string): Promise<Client> {
    await this.createDatabase(database)

    const client = new Client({ ...defaultClientOptions, database })

    await client.connect()

    return client
  }

  private async createDatabase(database: string): Promise<void> {
    const client = new Client(defaultClientOptions)

    await client.connect()
    await client.query(`DROP DATABASE IF EXISTS ${database}`)
    await client.query(`CREATE DATABASE ${database}`)
    await client.end()
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

const defaultClientOptions = {
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
  host: 'localhost',
} as const
