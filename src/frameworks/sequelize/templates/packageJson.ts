import { lines } from '@src/core/codegen'
import { DbOptions, SqlDialect } from '@src/core/database'
import { Schema } from '@src/core/schema'
import { kebabCase } from '@src/utils/string'
import { dbCreateSupported } from '../utils/scripts'

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
${scripts(dbOptions)}
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

function scripts({ sqlDialect, migrations }: DbOptions): string {
  const dbCreate = dbCreateSupported(sqlDialect)
  return lines(
    [
      '"test": "echo \\"Error: no test specified\\" && exit 1"',
      dbCreate && migrations
        ? '"db:up": "echo creating && npm run db:create && echo created && npm run db:migrate && echo migrated"'
        : null,
      dbCreate && migrations ? '"db:reset": "npm run db:drop && npm run db:up"' : null,
      dbCreate ? '"db:create": "sequelize db:create"' : null,
      dbCreate ? '"db:drop": "[[ $NODE_ENV == production ]] && exit 1 || sequelize db:drop"' : null,
      migrations ? '"db:migrate": "sequelize db:migrate"' : null,
      migrations ? '"db:rollback": "sequelize db:migrate:undo"' : null,
      migrations ? '"db:rollback:all": "sequelize db:migrate:undo:all"' : null,
      '"build": "tsc"',
      '"start": "node ./dist/server.js"',
      '"dev": "tsc-watch --onSuccess \\"node ./dist/server.js\\""',
    ],
    { depth: 4, separator: ',' },
  )
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
    ['sequelize-cli', '^6.2.0'],
    ['tsc-watch', '^4.2.9'],
    ['typescript', '^4.1.3'],
  ].filter((dep): dep is Dependency => !!dep)
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
