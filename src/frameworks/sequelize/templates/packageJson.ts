import { lines } from '@src/core/codegen'
import { DbOptions, SqlDialect } from '@src/core/database'
import { Schema } from '@src/core/schema'
import { kebabCase } from '@src/utils/string'

export type PackageJsonTemplateArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export function packageJsonTemplate({ schema, dbOptions }: PackageJsonTemplateArgs): string {
  return `{
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
${formatDeps(...commonDeps(), ...dialectDeps(dbOptions))}
  },
  "devDependencies": {
${formatDeps(...commonDevDeps(), ...dialectDevDeps(dbOptions))}
  }
}

`
}

type Dependency = [name: string, version: string]

const commonDeps = (): Dependency[] => [['sequelize', '^6.3.5']]

function dialectDeps({ sqlDialect }: DbOptions): Dependency[] {
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
      return [['sqlite3', '^5.0.1']]
  }
}

function commonDevDeps(): Dependency[] {
  return [
    ['@types/node', '^14.14.20'],
    ['@types/validator', '^13.1.3'],
    ['typescript', '^4.1.3'],
  ]
}

function dialectDevDeps({ sqlDialect }: DbOptions): Dependency[] {
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

function formatDeps(...ds: Dependency[]): string {
  return lines(
    ds
      .slice()
      .sort(([a], [b]) => a.localeCompare(b))
      .map(depKv),
    { separator: ',', depth: 4 },
  )
}

function depKv([name, version]: Dependency): string {
  return `"${name}": "${version}"`
}
