import { displaySqlDialect, parseSqlDialect, SqlDialect } from '../../../src/database'
import { DbClient, DbClientConstructor } from './client'
import { PostgresClient } from './postgres'

export { DbClient } from './client'

export async function createDatabase(database: string, dialect: SqlDialect): Promise<DbClient> {
  const constructor = getConstructor(dialect)
  const client = new constructor(database)
  await client.connected()
  if (!client.connected) {
    raiseClientNotConnected()
  }

  return client
}

export function dropDatabase(database: string, dialect: SqlDialect): Promise<void> {
  const constructor = getConstructor(dialect)
  return constructor.dropDatabase(database)
}

export function validateDialect(
  dialectString: string | undefined = process.env.SQL_DIALECT,
): SqlDialect {
  if (!dialectString) raiseDialectRequired()

  const dialect = parseSqlDialect(dialectString)

  if (!dialect) raiseInvalidDialect(dialectString)

  if (!dialectImplemented(dialect)) raiseDialectNotImplemented(dialect)

  return dialect
}

function getConstructor(dialect: SqlDialect): DbClientConstructor {
  switch (dialect) {
    case SqlDialect.Postgres:
      return PostgresClient
    default:
      raiseDialectNotImplemented(dialect)
  }
}

function dialectImplemented(dialect: SqlDialect): boolean {
  switch (dialect) {
    case SqlDialect.Postgres:
      return true
    default:
      return false
  }
}

function raiseClientNotConnected(): never {
  throw new Error('error connecting to database')
}

function raiseDialectRequired(): never {
  throw new Error('dialect must be provided or set as an environment variable SQL_DIALECT')
}

function raiseDialectNotImplemented(dialect: SqlDialect): never {
  throw new Error(`DbClient not implemented for dialect ${displaySqlDialect(dialect)}`)
}

function raiseInvalidDialect(dialect: string): never {
  throw new Error(`invalid dialect ${dialect} provided`)
}
