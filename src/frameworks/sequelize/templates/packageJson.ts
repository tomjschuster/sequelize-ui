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

const commonDeps = (): Dependency[] => [['sequelize', '^6.37.1']]

function dialectDeps({ sqlDialect }: DbOptions): Dependency[] {
  switch (sqlDialect) {
    case SqlDialect.MariaDb:
      return [['mariadb', '^3.2.3']]
    case SqlDialect.MsSql:
      return [['tedious', '^17.0.0']]
    case SqlDialect.MySql:
      return [['mysql2', '^3.9.2']]
    case SqlDialect.Postgres:
      return [
        ['pg', '^8.11.3'],
        ['pg-hstore', '^2.3.4'],
      ]
    case SqlDialect.Sqlite:
      return [['sqlite3', '^5.1.7']]
  }
}

function commonDevDeps(): Dependency[] {
  return [
    ['@types/node', '^20.11.24'],
    ['@types/validator', '^13.11.9'],
    ['sequelize-cli', '^6.6.2'],
    ['tsc-watch', '^6.0.4'],
    ['typescript', '^5.3.3'],
  ]
}

function dialectDevDeps({ sqlDialect }: DbOptions): Dependency[] {
  switch (sqlDialect) {
    case SqlDialect.MariaDb:
      return []
    case SqlDialect.MsSql:
      return [['@types/tedious', '^4.0.14']]
    case SqlDialect.MySql:
      return []
    case SqlDialect.Postgres:
      return []
    case SqlDialect.Sqlite:
      return [['@types/sqlite3', '^3.1.11']]
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

const dbCreateDialects: SqlDialect[] = [
  SqlDialect.MariaDb,
  SqlDialect.MsSql,
  SqlDialect.MySql,
  SqlDialect.Postgres,
]

function dbCreateSupported(dialect: SqlDialect): boolean {
  return dbCreateDialects.includes(dialect)
}
