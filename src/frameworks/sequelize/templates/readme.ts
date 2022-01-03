import { blank, lines } from '@src/core/codegen'
import { DbOptions, SqlDialect } from '@src/core/database'
import { Schema } from '@src/core/schema'
import {
  DemoSchemaType,
  displayDemoSchemaType,
  getDemoSchemaTypeById,
  sampleSchemaDescription,
} from '@src/data/schemas'
import { intersperse } from '@src/utils/array'

export type ReadmeTemplateArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export function readmeTemplate({ schema, dbOptions }: ReadmeTemplateArgs): string {
  const demoSchemaType = schema.forkedFrom
    ? getDemoSchemaTypeById(schema.forkedFrom)
    : getDemoSchemaTypeById(schema.id)

  return lines([
    `# ${schema.name}`,
    'This project was generated with [Sequelize UI](https://github.com/tomjschuster/sequelize-ui).',
    blank(),
    'The project is a simple [Node.js](https://nodejs.dev/) server with [Sequelize ORM](https://sequelize.org/)',
    blank(),
    schemaDescription(demoSchemaType),
    '## Getting Started',
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

function schemaDescription(demoSchemaType: DemoSchemaType | undefined): string | null {
  if (!demoSchemaType) return null

  const name = displayDemoSchemaType(demoSchemaType)

  return lines([
    '### Schema',
    `The Sequelize schema for this project was derived from the ${name} sample database.`,
    blank(),
    ...intersperse(sampleSchemaDescription(demoSchemaType), blank()),
    blank(),
  ])
}
