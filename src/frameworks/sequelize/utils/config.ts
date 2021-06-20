import { SqlDialect } from '@src/core/database'

export function sqlDialiectConfigValue(dialect: SqlDialect): string {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'mariadb'
    case SqlDialect.MsSql:
      return 'mssql'
    case SqlDialect.MySql:
      return 'mysql'
    case SqlDialect.Postgres:
      return 'postgres'
    case SqlDialect.Sqlite:
      return 'sqlite'
  }
}
