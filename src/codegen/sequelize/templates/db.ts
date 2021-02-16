import { Schema } from '../../../schema'
import {
  SqlDialect,
  defaultSqlDialectPort,
  displaySqlDialect,
  DatabaseOptions,
  defaultSqlDialectDatabase,
  defaultSqlDialectHost,
  defaultSqlDialectPassword,
  defaultSqlDialectStorage,
  defaultSqlDialectUsername,
  varSqlDialect,
} from '../../../database'
import { blank, lines } from '../../helpers'

export type DbTemplateArgs = {
  schema: Schema
  options: DatabaseOptions
}

export const dbTemplate = ({ schema, options }: DbTemplateArgs): string =>
  lines([
    imports(),
    blank(),
    instanceDeclaration({ schema, options }),
    blank(),
    exportInstance(),
    blank(),
  ])

const imports = (): string => `import { Sequelize } from 'sequelize'`

const instanceDeclaration = ({ schema, options }: DbTemplateArgs) =>
  lines([
    `const db: Sequelize = new Sequelize({`,
    lines(
      [
        dialectField(options.sqlDialect),
        storageField(options.sqlDialect),
        databaseField(schema.name, options.sqlDialect),
        usernameField(options.sqlDialect),
        passwordField(options.sqlDialect),
        hostField(options.sqlDialect),
        portField(options.sqlDialect),
        defineField(options),
      ],
      { separator: ',', depth: 2 },
    ),
    '})',
  ])

const exportInstance = (): string => 'export default db'

const dialectField = (dialect: SqlDialect): string => `dialect: '${displaySqlDialect(dialect)}'`

const storageField = (dialect: SqlDialect): string | null => {
  const defaultStorage = defaultSqlDialectStorage(dialect)
  return defaultStorage
    ? `storage: process.env.${varSqlDialect(dialect)} || '${defaultStorage}'`
    : null
}

const databaseField = (schemaName: string, dialect: SqlDialect): string | null => {
  const defaultDatabase = defaultSqlDialectDatabase(schemaName, dialect)
  return defaultDatabase
    ? `database: process.env.${varSqlDialect(dialect)}_DB_NAME || '${defaultDatabase}'`
    : null
}

const usernameField = (dialect: SqlDialect): string | null => {
  const defaultUsername = defaultSqlDialectUsername(dialect)
  return defaultUsername
    ? `username: process.env.${varSqlDialect(dialect)}_DB_USERNAME || '${defaultUsername}'`
    : null
}

const passwordField = (dialect: SqlDialect): string | null => {
  const defaultPassword = defaultSqlDialectPassword(dialect)
  return defaultPassword
    ? `password: process.env.${varSqlDialect(dialect)}_DB_PASSWORD || '${defaultPassword}'`
    : null
}

const hostField = (dialect: SqlDialect): string | null => {
  const defaultHost = defaultSqlDialectHost(dialect)
  return defaultHost
    ? `host: process.env.${varSqlDialect(dialect)}_DB_HOST || '${defaultHost}'`
    : null
}

const portField = (dialect: SqlDialect): string | null => {
  const defaultPort = defaultSqlDialectPort(dialect)
  return defaultPort
    ? `port: parseInt(process.env.${varSqlDialect(dialect)}_DB_PORT || '${defaultPort}')`
    : null
}

const hasOptions = (options: DatabaseOptions): boolean =>
  !options.timestamps || options.caseStyle === 'snake' || options.nounForm === 'singular'

const defineField = (options: DatabaseOptions): string | null =>
  !hasOptions(options)
    ? null
    : lines([
        `define: {`,
        lines(
          [
            freezeTableNameField(options),
            underscoredField(options.caseStyle === 'snake'),
            timestampsField(options.timestamps),
            createdAtField(options),
            updatedAtField(options),
          ],
          { separator: ',', depth: 2 },
        ),
        '}',
      ])

const underscoredField = (underscored: boolean): string | null =>
  underscored ? 'underscored: true' : null

const timestampsField = (timestamps: boolean): string | null =>
  timestamps ? null : 'timestamps: false'

const createdAtField = ({ caseStyle, timestamps }: DatabaseOptions): string | null =>
  caseStyle === 'snake' && timestamps ? `createdAt: 'created_at'` : null

const updatedAtField = ({ caseStyle, timestamps }: DatabaseOptions): string | null =>
  caseStyle === 'snake' && timestamps ? `updatedAt: 'updated_at'` : null

const freezeTableNameField = ({ caseStyle, nounForm }: DatabaseOptions): string | null =>
  caseStyle === 'camel' && nounForm === 'singular' ? `freezeTableName: true` : null
