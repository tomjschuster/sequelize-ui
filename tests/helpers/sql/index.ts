import { displaySqlDialect, parseSqlDialect, SqlDialect } from '../../../src/database'
import { DbConnection, DbConnectionConstructor } from './connection'
import { MsSqlConnection } from './mssql'
import { MySqlConnection } from './mysql'
import { PostgresConnection } from './postgres'

export { DbConnection } from './connection'

export async function createDatabase(database: string, dialect: SqlDialect): Promise<DbConnection> {
  const Connection = getConstructor(dialect)
  await Connection.createDatabase(database)
  const connection = new Connection(database)
  await connection.connected()
  return connection
}

export function dropDatabase(database: string, dialect: SqlDialect): Promise<void> {
  const Client = getConstructor(dialect)
  return Client.dropDatabase(database)
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

function getConstructor(dialect: SqlDialect): DbConnectionConstructor {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return MySqlConnection
    case SqlDialect.MsSql:
      return MsSqlConnection
    case SqlDialect.MySql:
      return MySqlConnection
    case SqlDialect.Postgres:
      return PostgresConnection
    default:
      raiseDialectNotImplemented(dialect)
  }
}

function dialectImplemented(dialect: SqlDialect): boolean {
  try {
    getConstructor(dialect)
    return true
  } catch (e) {
    return false
  }
}

function raiseDialectRequired(): never {
  throw new Error('dialect must be provided or set as an environment variable SQL_DIALECT')
}

function raiseDialectNotImplemented(dialect: SqlDialect): never {
  throw new Error(`DbConnection not implemented for dialect ${displaySqlDialect(dialect)}`)
}

function raiseInvalidDialect(dialect: string): never {
  throw new Error(`invalid dialect ${dialect} provided`)
}
