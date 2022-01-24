import { SchemaMeta } from '@src/api/meta'
import { blank, lines } from '@src/core/codegen'
import { DbOptions, SqlDialect } from '@src/core/database'
import { Schema } from '@src/core/schema'
import { intersperse } from '@src/utils/array'

export type ReadmeTemplateArgs = {
  schema: Schema
  meta?: SchemaMeta | null
  dbOptions: DbOptions
}

export function readmeTemplate({ schema, meta, dbOptions }: ReadmeTemplateArgs): string {
  return lines([
    `# ${schema.name}`,
    'This project was generated with [Sequelize UI](https://github.com/tomjschuster/sequelize-ui). The project is a simple [Node.js](https://nodejs.dev/) server with [Sequelize ORM](https://sequelize.org/).',
    blank(),
    'Be sure to test all code for correctness and to test database migrations in a test environment before deploying to production.',
    blank(),
    meta ? schemaDescription(meta) : null,
    '## Running Project',
    blank(),
    '### Prerequesites',
    '- [Node.js](https://nodejs.dev/)',
    `- ${dbDependency(dbOptions.sqlDialect)}`,
    blank(),
    '### Setup',
    '1. Install dependencies: `npm install`',
    '2. Setup database: `npm run db:up`',
    blank(),
    '### Run',
    '- Local development: `npm run dev`',
    '- Production build: `npm run build && npm start`',
    blank(),
    '## Bug Reports',
    'Please report any bugs with generated code at [Sequelize UI Issues](https://github.com/tomjschuster/sequelize-ui/issues).',
    blank(),
  ])
}

function dbDependency(dialect: SqlDialect): string {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return '[MariaDB](https://mariadb.com/)'
    case SqlDialect.MsSql:
      return '[SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2019)'
    case SqlDialect.MySql:
      return '[MariaDB](https://www.mysql.com/)'
    case SqlDialect.Postgres:
      return '[PostgreSQL](https://www.postgresql.org/)'
    case SqlDialect.Sqlite:
      return '[SQLite](https://www.sqlite.org/index.html)'
  }
}

function schemaDescription({ displayName, description }: SchemaMeta): string | null {
  return lines([
    '## Schema',
    `The Sequelize schema for this project was derived from the ${displayName} sample database.`,
    blank(),
    ...intersperse(description, blank()),
    blank(),
  ])
}
