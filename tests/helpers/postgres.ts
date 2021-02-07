import { Client } from 'pg'

export async function createPostgresDatabase(database: string): Promise<Client> {
  // console.time('create db')
  const setupClient = new Client({
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
    host: 'localhost',
  })

  await setupClient.connect()
  await setupClient.query(`DROP DATABASE IF EXISTS ${database}`)
  await setupClient.query(`CREATE DATABASE ${database}`)
  await setupClient.end()

  const client = new Client({
    user: 'postgres',
    database: database,
    password: 'postgres',
    port: 5432,
    host: 'localhost',
  })

  await client.connect()

  // console.timeEnd('create db')
  return client
}

export async function dropPostgresDatabase(database: string): Promise<void> {
  // console.time('drop db')

  const client = new Client({
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
    host: 'localhost',
  })

  await client.connect()
  await client.query(`DROP DATABASE IF EXISTS ${database}`)
  await client.end()
  // console.timeEnd('drop db')
}

export async function getPostgresTables(client: Client): Promise<string[]> {
  const QUERY = `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
  const result = await client.query(QUERY)
  return result.rows.map((r) => r.table_name)
}

export async function getPostgresColumns(client: Client, table: string): Promise<string[]> {
  const QUERY = `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}';`
  const result = await client.query(QUERY)
  return result.rows.map((r) => r.column_name)
}
