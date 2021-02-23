import { parseSqlDialect, SqlDialect } from '@sequelize-ui/core/database'
import { DbConnection, DbConnectionConstructor } from './connection'
import { MsSqlConnection } from './mssql'
import { MySqlConnection } from './mysql'
import { PostgresConnection } from './postgres'
import { SqlLiteConnection } from './sqlite'

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

export function validateDialect(dialectString?: string): SqlDialect {
  if (!dialectString) raiseDialectRequired()

  const dialect = parseSqlDialect(dialectString)

  if (!dialect) raiseInvalidDialect(dialectString)

  return dialect
}

export function preinstall(dialect: SqlDialect): string | null {
  const Client = getConstructor(dialect)
  return Client.preinstall ? Client.preinstall() : null
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
    case SqlDialect.Sqlite:
      return SqlLiteConnection
  }
}

function raiseDialectRequired(): never {
  throw new Error('dialect must be provided or set as an environment variable SQL_DIALECT')
}

function raiseInvalidDialect(dialect: string): never {
  throw new Error(`invalid dialect ${dialect} provided`)
}
