import { pascalCase, snakeCase } from 'change-case'

export type DatabaseOptions = {
  sqlDialect: SqlDialect
  timestamps: boolean
  caseStyle: 'snake' | 'camel'
  nounForm: 'singular' | 'plural'
}

export enum SqlDialect {
  MariaDb = 'MARIADB',
  MsSql = 'MSSQL',
  MySql = 'MYSQL',
  Postgres = 'POSTGRES',
  Sqlite = 'SQLITE',
}

export const displaySqlDialect = (dialect: SqlDialect): string => {
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

export const defaultSqlDialectPort = (dialect: SqlDialect): string | null => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return '3306'
    case SqlDialect.MsSql:
      return '1433'
    case SqlDialect.MySql:
      return '3306'
    case SqlDialect.Postgres:
      return '5432'
    case SqlDialect.Sqlite:
      return null
  }
}

export const defaultSqlDialectUsername = (dialect: SqlDialect): string | null => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'root'
    case SqlDialect.MsSql:
      return 'sa'
    case SqlDialect.MySql:
      return 'root'
    case SqlDialect.Postgres:
      return 'postgres'
    case SqlDialect.Sqlite:
      return null
  }
}

export const defaultSqlDialectDatabase = (name: string, dialect: SqlDialect): string | null => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return snakeCase(name)
    case SqlDialect.MsSql:
      return pascalCase(name)
    case SqlDialect.MySql:
      return snakeCase(name)
    case SqlDialect.Postgres:
      return snakeCase(name)
    case SqlDialect.Sqlite:
      return null
  }
}
