import { DbClient } from './client'
import { Client, QueryResult } from 'pg'

export class PostgresClient implements DbClient {
  constructor(database: string) {
    this.client = this.initializeClient(database)
  }

  connected(): Promise<boolean> {
    return this.connectedPromise
  }

  static async createDatabase(database: string): Promise<void> {
    const client = new Client(defaultClientOptions)

    await client.connect()
    await client.query(`DROP DATABASE IF EXISTS ${database}`)
    await client.query(`CREATE DATABASE ${database}`)
    await client.end()
  }

  static async dropDatabase(database: string): Promise<void> {
    const client = new Client(defaultClientOptions)

    await client.connect()
    await client.query(`DROP DATABASE IF EXISTS ${database}`)
    await client.end()
    return
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
    await client.end()
    this.connectedPromise = Promise.resolve(false)
    return
  }

  private static tablesQuery(): string {
    return `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
  }

  private static columnsQuery(table: string): string {
    return `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}';`
  }

  private client: Promise<Client>
  // eslint-disable-next-line
  // @ts-ignore
  private resolveConnected: (connected: boolean) => void
  private connectedPromise: Promise<boolean> = new Promise((resolve) => {
    this.resolveConnected = resolve
  })

  private async initializeClient(database: string): Promise<Client> {
    await PostgresClient.createDatabase(database)

    const client = new Client({ ...defaultClientOptions, database })
    try {
      await client.connect()
      this.resolveConnected(true)
    } catch (e) {
      this.resolveConnected(false)
      return Promise.reject(e)
    }
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

const defaultClientOptions = {
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
  host: 'localhost',
} as const
