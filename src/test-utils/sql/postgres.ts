import { Client, ClientConfig, QueryResult, QueryResultRow } from 'pg'
import { DbConnection, DbConnectionConstructor } from './connection'

export const PostgresConnection: DbConnectionConstructor = class PostgresConnection
  implements DbConnection
{
  private static clientConfig: ClientConfig = {
    user: process.env.POSTGRES_DB_USER || 'postgres',
    password: process.env.POSTGRES_DB_PASSWORD || 'postgres',
    port: parseInt(process.env.POSTGRES_DB_PORT || '5432'),
    host: process.env.POSTGRES_DB_HOST || 'localhost',
  }

  constructor(database: string) {
    this.client = PostgresConnection.createClient(database)
  }

  private client: Promise<Client>

  connected(): Promise<boolean> {
    return this.client.then(() => true)
  }

  async close(): Promise<void> {
    return PostgresConnection.close(await this.client)
  }

  async getTables(): Promise<string[]> {
    const statement = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
    const result = await this.query<TablesResult>(statement)
    return result.rows.map((r) => r.table_name)
  }

  async getColumns(table: string): Promise<string[]> {
    const statement = `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}';`
    const result = await this.query<ColumnsResult>(statement)
    return result.rows.map((r) => r.column_name)
  }

  static async createDatabase(database: string): Promise<void> {
    const client = await PostgresConnection.createClient()
    await PostgresConnection.query(client, `DROP DATABASE IF EXISTS ${database};`)
    await PostgresConnection.query(client, `CREATE DATABASE ${database};`)
    await PostgresConnection.close(client)
  }

  static async dropDatabase(database: string): Promise<void> {
    const client = await PostgresConnection.createClient()
    await PostgresConnection.query(client, `DROP DATABASE IF EXISTS ${database};`)
    await PostgresConnection.close(client)
    return
  }

  private async query<T extends QueryResultRow>(queryString: string): Promise<QueryResult<T>> {
    const client = await this.client
    return client.query<T>(queryString)
  }

  private static async createClient(database?: string): Promise<Client> {
    const config = database
      ? { ...PostgresConnection.clientConfig, database }
      : PostgresConnection.clientConfig

    const client = new Client(config)
    await client.connect()
    return client
  }

  private static async close(client: Client): Promise<void> {
    return client.end()
  }

  private static async query<T extends QueryResult<T>>(
    client: Client,
    statement: string,
  ): Promise<QueryResult<T>> {
    return client.query<T>(statement)
  }
}

type TablesResult = {
  table_name: string
}

type ColumnsResult = {
  column_name: string
}
