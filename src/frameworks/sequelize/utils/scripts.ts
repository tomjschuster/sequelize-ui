import { SqlDialect } from '@src/core/database'

const dbCreateDialects: SqlDialect[] = [SqlDialect.Postgres, SqlDialect.MsSql]

export function dbCreateSupported(dialect: SqlDialect): boolean {
  return dbCreateDialects.includes(dialect)
}
