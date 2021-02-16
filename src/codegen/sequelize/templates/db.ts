import { Schema } from '../../../schema'
import {
  SqlDialect,
  defaultSqlDialectPort,
  displaySqlDialect,
  DatabaseOptions,
  defaultSqlDialectUsername,
  defaultSqlDialectDatabase,
  defaultSqlDialectPassword,
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
  `const db: Sequelize = new Sequelize({
  ${lines(
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
  )}
})`

const exportInstance = (): string => 'export default db'

const dialectField = (dialect: SqlDialect): string => `dialect: '${displaySqlDialect(dialect)}'`

const storageField = (dialect: SqlDialect): string | null =>
  dialect !== SqlDialect.Sqlite ? null : `storage: '.tmp/data.db'`

const databaseField = (schemaName: string, dialect: SqlDialect): string | null => {
  const defaultDatabase = defaultSqlDialectDatabase(schemaName, dialect)
  return dialect === SqlDialect.Sqlite
    ? null
    : `database: process.env.${displaySqlDialect(dialect).toUpperCase()}_DB_NAME${
        defaultDatabase ? ` || '${defaultDatabase}'` : ''
      }`
}

const usernameField = (dialect: SqlDialect): string | null => {
  const defaultUsername = defaultSqlDialectUsername(dialect)
  return dialect === SqlDialect.Sqlite
    ? null
    : `username: process.env.${displaySqlDialect(dialect).toUpperCase()}_DB_USERNAME${
        defaultUsername ? ` || '${defaultUsername}'` : ''
      }`
}

const passwordField = (dialect: SqlDialect): string | null => {
  const defaultPassword = defaultSqlDialectPassword(dialect)
  return dialect === SqlDialect.Sqlite
    ? null
    : `password: process.env.${displaySqlDialect(dialect).toUpperCase()}_DB_PASSWORD${
        defaultPassword ? ` || '${defaultPassword}'` : ''
      }`
}

const hostField = (dialect: SqlDialect): string | null =>
  dialect === SqlDialect.Sqlite
    ? null
    : `host: process.env.${displaySqlDialect(dialect).toUpperCase()}_DB_HOST || 'localhost'`

const portField = (dialect: SqlDialect): string | null =>
  !defaultSqlDialectPort(dialect)
    ? null
    : `port: parseInt(process.env.${displaySqlDialect(
        dialect,
      ).toUpperCase()}_DB_PORT || '${defaultSqlDialectPort(dialect)}')`

const hasOptions = (options: DatabaseOptions): boolean =>
  !options.timestamps || options.caseStyle === 'snake' || options.nounForm === 'singular'

const defineField = (options: DatabaseOptions): string | null =>
  !hasOptions(options)
    ? null
    : `define: {
  ${lines(
    [
      freezeTableNameField(options),
      underscoredField(options.caseStyle === 'snake'),
      timestampsField(options.timestamps),
      createdAtField(options),
      updatedAtField(options),
    ],
    { separator: ',', depth: 2 },
  )}
}`

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
