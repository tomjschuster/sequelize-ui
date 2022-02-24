import { UserPreferences } from '@src/api/userPreferences/api'
import { DbCaseStyle, DbNounForm, DbOptions, SqlDialect } from '@src/core/database'
import {
  DbOptions as DbOptionsV1,
  DbOptionsCaseStyle,
  DbOptionsNounForm,
  DbOptionsSqlDialect,
  UserPreferencesV1,
} from '.'

export function fromV1(preferences: UserPreferencesV1): UserPreferences {
  return { defaultDbOptions: fromV1DbOptions(preferences.defaultDbOptions) }
}

export function toV1(preferences: UserPreferences): UserPreferencesV1 {
  return {
    defaultDbOptions: toV1DbOptions(preferences.defaultDbOptions),
  }
}

export function fromV1DbOptions(dbOptions: DbOptionsV1): DbOptions {
  return {
    ...dbOptions,
    sqlDialect: fromV1SqlDialect(dbOptions.sqlDialect),
    caseStyle: fromV1CaseStyle(dbOptions.caseStyle),
    nounForm: fromV1NounForm(dbOptions.nounForm),
  }
}

function fromV1SqlDialect(sqlDialect: DbOptionsSqlDialect): SqlDialect {
  switch (sqlDialect) {
    case DbOptionsSqlDialect.Postgres:
      return SqlDialect.Postgres
    case DbOptionsSqlDialect.Sqlite:
      return SqlDialect.Sqlite
    case DbOptionsSqlDialect.Mysql:
      return SqlDialect.MySql
    case DbOptionsSqlDialect.Mariadb:
      return SqlDialect.MariaDb
    case DbOptionsSqlDialect.Mssql:
      return SqlDialect.MsSql
  }
}

export function toV1DbOptions(dbOptions: DbOptions): DbOptionsV1 {
  return {
    ...dbOptions,
    sqlDialect: toV1SqlDialect(dbOptions.sqlDialect),
    caseStyle: toV1CaseStyle(dbOptions.caseStyle),
    nounForm: toV1NounForm(dbOptions.nounForm),
  }
}

function fromV1NounForm(sqlDialect: DbOptionsNounForm): DbNounForm {
  switch (sqlDialect) {
    case DbOptionsNounForm.Singular:
      return DbNounForm.Singular
    case DbOptionsNounForm.Plural:
      return DbNounForm.Plural
  }
}

function fromV1CaseStyle(sqlDialect: DbOptionsCaseStyle): DbCaseStyle {
  switch (sqlDialect) {
    case DbOptionsCaseStyle.Snake:
      return DbCaseStyle.Snake
    case DbOptionsCaseStyle.Camel:
      return DbCaseStyle.Camel
  }
}

function toV1SqlDialect(sqlDialect: SqlDialect): DbOptionsSqlDialect {
  switch (sqlDialect) {
    case SqlDialect.Postgres:
      return DbOptionsSqlDialect.Postgres
    case SqlDialect.Sqlite:
      return DbOptionsSqlDialect.Sqlite
    case SqlDialect.MySql:
      return DbOptionsSqlDialect.Mysql
    case SqlDialect.MariaDb:
      return DbOptionsSqlDialect.Mariadb
    case SqlDialect.MsSql:
      return DbOptionsSqlDialect.Mssql
  }
}

function toV1NounForm(sqlDialect: DbNounForm): DbOptionsNounForm {
  switch (sqlDialect) {
    case DbNounForm.Singular:
      return DbOptionsNounForm.Singular
    case DbNounForm.Plural:
      return DbOptionsNounForm.Plural
  }
}

function toV1CaseStyle(sqlDialect: DbCaseStyle): DbOptionsCaseStyle {
  switch (sqlDialect) {
    case DbCaseStyle.Snake:
      return DbOptionsCaseStyle.Snake
    case DbCaseStyle.Camel:
      return DbOptionsCaseStyle.Camel
  }
}
