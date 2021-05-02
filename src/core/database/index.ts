import { pascalCase, snakeCase } from 'change-case'

export type DbOptions = {
  sqlDialect: SqlDialect
  prefixPks: boolean | null
  timestamps: boolean
  caseStyle: DbCaseStyle
  nounForm: DbNounForm
}

export enum DbCaseStyle {
  Snake = 'snake',
  Camel = 'camel',
}

export enum DbNounForm {
  Singular = 'singular',
  Plural = 'plural',
}

export enum SqlDialect {
  MariaDb = 'mariadb',
  MsSql = 'mssql',
  MySql = 'mysql',
  Postgres = 'postgres',
  Sqlite = 'sqlite',
}

export function displaySqlDialect(dialect: SqlDialect): string {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'MariaDB'
    case SqlDialect.MsSql:
      return 'SQL Server'
    case SqlDialect.MySql:
      return 'MySQL'
    case SqlDialect.Postgres:
      return 'PostgreSQL'
    case SqlDialect.Sqlite:
      return 'SQLite'
  }
}

export function sqlDialectEnvVar(dialect: SqlDialect): string {
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

export function parseSqlDialect(dialect: string): SqlDialect | null {
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

export function defaultSqlDialectPort(dialect: SqlDialect): string | null {
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

export function defaultSqlDialectUsername(dialect: SqlDialect): string | null {
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

export function defaultSqlDialectPassword(dialect: SqlDialect): string | null {
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

export function defaultSqlDialectDatabase(name: string, dialect: SqlDialect): string | null {
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

export function defaultSqlDialectHost(dialect: SqlDialect): string | null {
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

export function defaultSqlDialectStorage(dialect: SqlDialect): string | null {
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

export function displayDatabaseNounForm(nounForm: DbNounForm): string {
  switch (nounForm) {
    case DbNounForm.Singular:
      return 'singular'
    case DbNounForm.Plural:
      return 'plural'
  }
}

export function displayDatabaseCaseStyle(caseStyle: DbCaseStyle): string {
  switch (caseStyle) {
    case DbCaseStyle.Snake:
      return 'snake'
    case DbCaseStyle.Camel:
      return 'camel'
  }
}

export const defaultDbOptions: DbOptions = {
  sqlDialect: SqlDialect.Postgres,
  prefixPks: null,
  timestamps: true,
  caseStyle: DbCaseStyle.Snake,
  nounForm: DbNounForm.Plural,
}

export const MAX_IDENTIFIER_LENGTH = 63
