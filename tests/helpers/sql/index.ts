import { displaySqlDialect, parseSqlDialect, SqlDialect } from '../../../src/database'
import { DbClient } from './client'
import { PostgresClient } from './postgres'

export { DbClient, createDbClient, validateDialect }

function createDbClient(database: string, dialect: SqlDialect): DbClient {
  switch (dialect) {
    case SqlDialect.Postgres:
      return new PostgresClient(database)
    default:
      raiseDialectNotImplemented(dialect)
  }
}

function validateDialect(dialectString: string | undefined = process.env.SQL_DIALECT): SqlDialect {
  if (!dialectString) raiseDialectRequired()

  const dialect = parseSqlDialect(dialectString)

  if (!dialect) raiseInvalidDialect(dialectString)

  if (!dialectImplemented(dialect)) raiseDialectNotImplemented(dialect)

  return dialect
}

function dialectImplemented(dialect: SqlDialect): boolean {
  switch (dialect) {
    case SqlDialect.Postgres:
      return true
    default:
      return false
  }
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
