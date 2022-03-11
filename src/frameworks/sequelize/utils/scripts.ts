import { SqlDialect } from '@src/core/database'

const dbCreateDialects: SqlDialect[] = [
  SqlDialect.MariaDb,
  SqlDialect.MsSql,
  SqlDialect.MySql,
  SqlDialect.Postgres,
]

export function dbCreateSupported(dialect: SqlDialect): boolean {
  return dbCreateDialects.includes(dialect)
}
