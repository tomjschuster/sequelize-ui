import { Schema } from '../../../schema'
import {
  SqlDialect,
  defaultSqlDialectPort,
  displaySqlDialect,
  DatabaseOptions,
  defaultSqlDialectUsername,
  defaultSqlDialectDatabase,
} from '../../../database'
import { indent, blank } from '../../helpers'

export { dbTemplate, DbTemplateArgs }

type DbTemplateArgs = {
  schema: Schema
  options: DatabaseOptions
}
const dbTemplate = ({ schema, options }: DbTemplateArgs): string =>
  [
    imports(),
    blank(),
    instanceDeclaration({ schema, options }),
    blank(),
    exportInstance(),
    blank(),
  ].join('\n')

const imports = (): string => `import { Sequelize } from 'sequelize';`

const instanceDeclaration = ({ schema, options }: DbTemplateArgs) =>
  `const db: Sequelize = new Sequelize({
  ${indent(
    2,
    [
      dialectField(options.sqlDialect),
      storageField(options.sqlDialect),
      databaseField(schema.name, options.sqlDialect),
      usernameField(options.sqlDialect),
      passwordField(options.sqlDialect),
      hostField(options.sqlDialect),
      portField(options.sqlDialect),
      hasOptions(options) ? defineField(options) : '',
    ]
      .filter((x) => x)
      .join(',\n'),
  )}
})`

const exportInstance = (): string => 'export default db;'

const dialectField = (dialect: SqlDialect): string => `dialect: '${displaySqlDialect(dialect)}'`

const storageField = (dialect: SqlDialect): string =>
  dialect === SqlDialect.Sqlite ? 'storage: :memory' : ''

const databaseField = (schemaName: string, dialect: SqlDialect): string => {
  const defaultDatabase = defaultSqlDialectDatabase(schemaName, dialect)
  return dialect === SqlDialect.Sqlite
    ? ''
    : `database: process.env.DB_NAME${defaultDatabase ? ` | '${defaultDatabase}'` : ''}`
}

const usernameField = (dialect: SqlDialect): string => {
  const defaultUsername = defaultSqlDialectUsername(dialect)
  return dialect === SqlDialect.Sqlite
    ? ''
    : `username: process.env.DB_USERNAME${defaultUsername ? ` || '${defaultUsername}'` : ''}`
}

const passwordField = (dialect: SqlDialect): string => {
  const defaultUsername = defaultSqlDialectUsername(dialect)
  return dialect === SqlDialect.Sqlite
    ? ''
    : `password: process.env.DB_PASSWORD${defaultUsername ? ` || '${defaultUsername}'` : ''}`
}

const hostField = (dialect: SqlDialect): string =>
  dialect === SqlDialect.Sqlite ? '' : `host: process.env.DB_HOST || 'localhost'`

const portField = (dialect: SqlDialect): string => {
  const port = defaultSqlDialectPort(dialect)
  return port ? `port: parseInt(process.env.DB_PORT || '${port}')` : ''
}

const hasOptions = (options: DatabaseOptions): boolean => {
  return !options.timestamps || options.caseStyle === 'snake' || options.nounForm === 'singular'
}

const defineField = (options: DatabaseOptions): string =>
  `define: {
  ${indent(
    2,
    [
      freezeTableNameField(options),
      underscoredField(options.caseStyle === 'snake'),
      timestampsField(options.timestamps),
      createdAtField(options),
      updatedAtField(options),
    ]
      .filter((x) => x)
      .join(',\n'),
  )}
}`

const underscoredField = (underscored: boolean): string => (underscored ? 'underscored: true' : '')
const timestampsField = (timestamps: boolean): string => (timestamps ? '' : 'timestamps: false')

const createdAtField = ({ caseStyle, timestamps }: DatabaseOptions) =>
  caseStyle === 'snake' && timestamps ? `timestamps: 'created_at'` : ''

const updatedAtField = ({ caseStyle, timestamps }: DatabaseOptions) =>
  caseStyle === 'snake' && timestamps ? `timestamps: 'updated_at'` : ''

const freezeTableNameField = ({ caseStyle, nounForm }: DatabaseOptions): string =>
  caseStyle === 'camel' && nounForm === 'singular' ? `freezeTableName: true` : ''
