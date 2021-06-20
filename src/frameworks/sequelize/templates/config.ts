import { lines } from '@src/core/codegen'
import {
  DbOptions,
  defaultSqlDialectDatabase,
  defaultSqlDialectHost,
  defaultSqlDialectPassword,
  defaultSqlDialectPort,
  defaultSqlDialectStorage,
  defaultSqlDialectUsername,
  SqlDialect,
  sqlDialectEnvVar,
} from '@src/core/database'
import { Schema } from '@src/core/schema'
import { sqlDialiectConfigValue } from '../utils/config'

export type DbTemplateArgs = {
  schema: Schema
  dbOptions: DbOptions
}
export function config({ schema, dbOptions }: DbTemplateArgs): string {
  return lines([
    `module.exports = {`,
    lines(
      [
        envConfig({ env: 'development', schema, dbOptions, fallback: true }),
        envConfig({ env: 'test', schema, dbOptions, fallback: true }),
        envConfig({ env: 'production', schema, dbOptions, fallback: false }),
      ],
      { depth: 2, separator: ',' },
    ),
    `}`,
  ])
}

export type EnvConfigArguments = {
  env: string
  schema: Schema
  dbOptions: DbOptions
  fallback: boolean
}

function envConfig({ env, schema, dbOptions, fallback }: EnvConfigArguments): string {
  return lines([
    `${env}: {`,
    lines(
      [
        dialectField(dbOptions.sqlDialect),
        storageField(dbOptions.sqlDialect, fallback),
        databaseField(schema.name, dbOptions.sqlDialect, fallback),
        usernameField(dbOptions.sqlDialect, fallback),
        passwordField(dbOptions.sqlDialect, fallback),
        hostField(dbOptions.sqlDialect, fallback),
        portField(dbOptions.sqlDialect, fallback),
      ],
      { depth: 2, separator: ',' },
    ),
    '}',
  ])
}

const dialectField = (dialect: SqlDialect): string =>
  `dialect: '${sqlDialiectConfigValue(dialect)}'`

const fallbackValue = (value: string, fallback: boolean): string => (fallback ? ` || ${value}` : '')

const storageField = (dialect: SqlDialect, fallback: boolean): string | null => {
  const defaultStorage = defaultSqlDialectStorage(dialect)
  return defaultStorage
    ? `storage: process.env.${sqlDialectEnvVar(dialect)}${fallbackValue(
        `'${defaultStorage}'`,
        fallback,
      )}`
    : null
}

const databaseField = (
  schemaName: string,
  dialect: SqlDialect,
  fallback: boolean,
): string | null => {
  const defaultDatabase = defaultSqlDialectDatabase(schemaName, dialect)
  return defaultDatabase
    ? `database: process.env.${sqlDialectEnvVar(dialect)}_DB_NAME${fallbackValue(
        `'${defaultDatabase}'`,
        fallback,
      )}`
    : null
}

const usernameField = (dialect: SqlDialect, fallback: boolean): string | null => {
  const defaultUsername = defaultSqlDialectUsername(dialect)
  return defaultUsername
    ? `username: process.env.${sqlDialectEnvVar(dialect)}_DB_USERNAME${fallbackValue(
        `'${defaultUsername}'`,
        fallback,
      )}`
    : null
}

const passwordField = (dialect: SqlDialect, fallback: boolean): string | null => {
  const defaultPassword = defaultSqlDialectPassword(dialect)
  return defaultPassword
    ? `password: process.env.${sqlDialectEnvVar(dialect)}_DB_PASSWORD${fallbackValue(
        `'${defaultPassword}'`,
        fallback,
      )}`
    : null
}

const hostField = (dialect: SqlDialect, fallback: boolean): string | null => {
  const defaultHost = defaultSqlDialectHost(dialect)
  return defaultHost
    ? `host: process.env.${sqlDialectEnvVar(dialect)}_DB_HOST${fallbackValue(
        `'${defaultHost}'`,
        fallback,
      )}`
    : null
}

const portField = (dialect: SqlDialect, fallback: boolean): string | null => {
  const defaultPort = defaultSqlDialectPort(dialect)
  return defaultPort
    ? `port: parseInt(process.env.${sqlDialectEnvVar(dialect)}_DB_PORT${fallbackValue(
        `'${defaultPort}'`,
        fallback,
      )})`
    : null
}
