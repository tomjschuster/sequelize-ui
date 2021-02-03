import { DatabaseOptions, SqlDialect } from '../../../database'
import { kebabCase } from '../../../helpers/string'
import { Schema } from '../../../schema'
import { lines } from '../../helpers'

export { packageJsonTemplate, PackageJsonTemplateArgs }

type PackageJsonTemplateArgs = {
  schema: Schema
  options: DatabaseOptions
}

const packageJsonTemplate = ({ schema, options }: PackageJsonTemplateArgs): string =>
  `{
  "name": "${kebabCase(schema.name)}",
  "version": "0.0.1",
  "description": "",
  "main": "server.ts",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "build": "tsc",
    "start": "node ./dist/server.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    ${formatDeps(...commonDeps(), ...dialectDeps(options))}
  }
  "devDependencies": {
    ${formatDeps(...commonDevDeps(), ...dialectDevDeps(options))}
  }
}

`

type Dependency = [name: string, version: string]

const commonDeps = (): Dependency[] => [['sequelize', '^6.3.5']]

const dialectDeps = ({ sqlDialect }: DatabaseOptions): Dependency[] => {
  switch (sqlDialect) {
    case SqlDialect.MariaDb:
      return [['mariadb', '^2.5.2']]
    case SqlDialect.MsSql:
      return [['tedious', '^11.0.3']]
    case SqlDialect.MySql:
      return [['mysql2', '^2.2.5']]
    case SqlDialect.Postgres:
      return [
        ['pg', '^8.5.1'],
        ['pg-hstore', '^2.3.3'],
      ]
    case SqlDialect.Sqlite:
      return [['sqlite', '^5.0.1']]
  }
}

const commonDevDeps = (): Dependency[] => [
  ['@types/node', '^14.14.20'],
  ['typescript', '^4.1.3'],
]

const dialectDevDeps = ({ sqlDialect }: DatabaseOptions): Dependency[] => {
  switch (sqlDialect) {
    case SqlDialect.MariaDb:
      return []
    case SqlDialect.MsSql:
      return [['@types/tedious', '^4.0.3']]
    case SqlDialect.MySql:
      return []
    case SqlDialect.Postgres:
      return []
    case SqlDialect.Sqlite:
      return [['@types/sqlite3', '^3.1.7']]
  }
}

const formatDeps = (...ds: Dependency[]): string =>
  lines(
    ds
      .slice()
      .sort(([a], [b]) => a.localeCompare(b))
      .map(depKv),
    { separator: ',', depth: 4 },
  )

const depKv = ([name, version]: Dependency): string => `"${name}": "${version}"`
