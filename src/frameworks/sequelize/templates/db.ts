import { blank, lines } from '@src/core/codegen'
import {
  DbCaseStyle,
  DbNounForm,
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
import { sqlDialiectConfigValue } from '../helpers'

export type DbTemplateArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export function dbTemplate({ schema, dbOptions }: DbTemplateArgs): string {
  return lines([
    imports(),
    blank(),
    instanceDeclaration({ schema, dbOptions }),
    blank(),
    exportInstance(),
    blank(),
  ])
}

const imports = (): string => `import { Sequelize } from 'sequelize'`

const instanceDeclaration = ({ schema, dbOptions }: DbTemplateArgs) =>
  lines([
    `const db: Sequelize = new Sequelize({`,
    lines(
      [
        dialectField(dbOptions.sqlDialect),
        storageField(dbOptions.sqlDialect),
        databaseField(schema.name, dbOptions.sqlDialect),
        usernameField(dbOptions.sqlDialect),
        passwordField(dbOptions.sqlDialect),
        hostField(dbOptions.sqlDialect),
        portField(dbOptions.sqlDialect),
        defineField(dbOptions),
      ],
      { separator: ',', depth: 2 },
    ),
    '})',
  ])

const exportInstance = (): string => 'export default db'

const dialectField = (dialect: SqlDialect): string =>
  `dialect: '${sqlDialiectConfigValue(dialect)}'`

const storageField = (dialect: SqlDialect): string | null => {
  const defaultStorage = defaultSqlDialectStorage(dialect)
  return defaultStorage
    ? `storage: process.env.${sqlDialectEnvVar(dialect)} || '${defaultStorage}'`
    : null
}

const databaseField = (schemaName: string, dialect: SqlDialect): string | null => {
  const defaultDatabase = defaultSqlDialectDatabase(schemaName, dialect)
  return defaultDatabase
    ? `database: process.env.${sqlDialectEnvVar(dialect)}_DB_NAME || '${defaultDatabase}'`
    : null
}

const usernameField = (dialect: SqlDialect): string | null => {
  const defaultUsername = defaultSqlDialectUsername(dialect)
  return defaultUsername
    ? `username: process.env.${sqlDialectEnvVar(dialect)}_DB_USERNAME || '${defaultUsername}'`
    : null
}

const passwordField = (dialect: SqlDialect): string | null => {
  const defaultPassword = defaultSqlDialectPassword(dialect)
  return defaultPassword
    ? `password: process.env.${sqlDialectEnvVar(dialect)}_DB_PASSWORD || '${defaultPassword}'`
    : null
}

const hostField = (dialect: SqlDialect): string | null => {
  const defaultHost = defaultSqlDialectHost(dialect)
  return defaultHost
    ? `host: process.env.${sqlDialectEnvVar(dialect)}_DB_HOST || '${defaultHost}'`
    : null
}

const portField = (dialect: SqlDialect): string | null => {
  const defaultPort = defaultSqlDialectPort(dialect)
  return defaultPort
    ? `port: parseInt(process.env.${sqlDialectEnvVar(dialect)}_DB_PORT || '${defaultPort}')`
    : null
}

const hasOptions = (dbOptions: DbOptions): boolean =>
  !dbOptions.timestamps ||
  dbOptions.caseStyle === DbCaseStyle.Snake ||
  dbOptions.nounForm === DbNounForm.Singular

const defineField = (dbOptions: DbOptions): string | null =>
  !hasOptions(dbOptions)
    ? null
    : lines([
        `define: {`,
        lines(
          [
            freezeTableNameField(dbOptions),
            underscoredField(dbOptions.caseStyle === DbCaseStyle.Snake),
            timestampsField(dbOptions.timestamps),
            createdAtField(dbOptions),
            updatedAtField(dbOptions),
          ],
          { separator: ',', depth: 2 },
        ),
        '}',
      ])

const underscoredField = (underscored: boolean): string | null =>
  underscored ? 'underscored: true' : null

const timestampsField = (timestamps: boolean): string | null =>
  timestamps ? null : 'timestamps: false'

const createdAtField = ({ caseStyle, timestamps }: DbOptions): string | null =>
  caseStyle === DbCaseStyle.Snake && timestamps ? `createdAt: 'created_at'` : null

const updatedAtField = ({ caseStyle, timestamps }: DbOptions): string | null =>
  caseStyle === DbCaseStyle.Snake && timestamps ? `updatedAt: 'updated_at'` : null

const freezeTableNameField = ({ caseStyle, nounForm }: DbOptions): string | null =>
  caseStyle === DbCaseStyle.Camel && nounForm === DbNounForm.Singular
    ? `freezeTableName: true`
    : null
