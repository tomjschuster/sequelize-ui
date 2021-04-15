import { pascalCase, snakeCase } from 'change-case'

export type DatabaseOptions = {
  sqlDialect: SqlDialect
  timestamps: boolean
  caseStyle: DatabaseCaseStyle
  nounForm: DatabaseNounForm
}

export enum DatabaseCaseStyle {
  Snake = 'SNAKE',
  Camel = 'CAMEL',
}

export enum DatabaseNounForm {
  Singular = 'SINGULAR',
  Plural = 'PLURAL',
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

export const varSqlDialect = (dialect: SqlDialect): string => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'MARIADB'
    case SqlDialect.MsSql:
      return 'MSSQL'
    case SqlDialect.MySql:
      return 'MYSQL'
    case SqlDialect.Postgres:
      return 'POSTGRES'
    case SqlDialect.Sqlite:
      return 'SQLITE'
  }
}

export const parseSqlDialect = (dialect: string): SqlDialect | null => {
  switch (dialect) {
    case 'mariadb':
      return SqlDialect.MariaDb
    case 'mssql':
      return SqlDialect.MsSql
    case 'mysql':
      return SqlDialect.MySql
    case 'postgres':
      return SqlDialect.Postgres
    case 'sqlite':
      return SqlDialect.Sqlite
    default:
      return null
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

export const defaultSqlDialectPassword = (dialect: SqlDialect): string | null => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'root'
    case SqlDialect.MsSql:
      return 'Password1'
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

export const defaultSqlDialectHost = (dialect: SqlDialect): string | null => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'localhost'
    case SqlDialect.MsSql:
      return 'localhost'
    case SqlDialect.MySql:
      return 'localhost'
    case SqlDialect.Postgres:
      return 'localhost'
    case SqlDialect.Sqlite:
      return null
  }
}

export const defaultSqlDialectStorage = (dialect: SqlDialect): string | null => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return null
    case SqlDialect.MsSql:
      return null
    case SqlDialect.MySql:
      return null
    case SqlDialect.Postgres:
      return null
    case SqlDialect.Sqlite:
      return '.tmp/data.db'
  }
}

export const sqlCurrentTimestamp = (): string => 'CURRENT_TIMESTAMP'
export const sqlCurrentDate = (): string => 'CURRENT_DATE'
export const sqlCurrentTime = (): string => 'CURRENT_TIME'

export const displayDatabaseNounForm = (nounForm: DatabaseNounForm): string => {
  switch (nounForm) {
    case DatabaseNounForm.Singular:
      return 'singular'
    case DatabaseNounForm.Plural:
      return 'plural'
  }
}

export const displayDatabaseCaseStyle = (caseStyle: DatabaseCaseStyle): string => {
  switch (caseStyle) {
    case DatabaseCaseStyle.Snake:
      return 'snake'
    case DatabaseCaseStyle.Camel:
      return 'camel'
  }
}

export const MAX_IDENTIFIER_LENGTH = 63
