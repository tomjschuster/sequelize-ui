import { blank, lines } from '@src/core/codegen'
import { DbOptions, SqlDialect } from '@src/core/database'
import { License, licenseText, licenseTitle } from '@src/core/oss/license'
import { Schema } from '@src/core/schema'
import {
  DemoSchemaType,
  displayDemoSchemaType,
  getDemoSchemaLicense,
  getDemoSchemaTypeById,
} from '@src/data/schemas'

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
    schemaBackground(demoSchemaType),
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
    license(demoSchemaType),
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

function schemaBackground(demoSchemaType: DemoSchemaType | undefined): string | null {
  if (!demoSchemaType) return null

  const schemaName = displayDemoSchemaType(demoSchemaType)

  return lines([
    '## Schema Background',
    `The schema for this project was derived from the ${schemaName} sample database.`,
    blank(),
    schemaSpecificBackground(demoSchemaType),
    blank(),
    'The Sequelize code for this schema was created by Tom Schuster made available through Sequelize UI at https://github.com/tomjschuster/sequelize-ui.',
    blank(),
  ])
}

function schemaSpecificBackground(demoSchemaType: DemoSchemaType): string {
  switch (demoSchemaType) {
    case DemoSchemaType.Blog:
      return blogBackground
    case DemoSchemaType.Employees:
      return employeeBackground
    case DemoSchemaType.Sakila:
      return sakilaBackground
  }
}

function license(demoSchemaType: DemoSchemaType | undefined): string {
  const license = demoSchemaType ? getDemoSchemaLicense(demoSchemaType) : License.Mit

  return lines(['## License', `${licenseTitle(license)} License`, blank(), licenseText(license)])
}

const blogName = displayDemoSchemaType(DemoSchemaType.Blog)

const blogBackground = lines([
  `The ${blogName} sample database schema was created by Bhagwat Singh Chouhan with Tutorisl24x7 and is available at https://github.com/tutorials24x7/blog-database-mysql.`,
])

const employeeName = displayDemoSchemaType(DemoSchemaType.Employees)

const employeeBackground = lines([
  `The ${employeeName} sample database schema was created by Fusheng Wang and Carlo Zaniolo and is available XML format at http://www.cs.aau.dk/TimeCenter/software.htm.`,
  blank(),
  'The relational schema for this data was created by Giuseppe Maxia and the data was converted from XML to relational by Patrick Crews. The schema and data are available at https://github.com/datacharmer/test_db.',
])

const sakilaName = displayDemoSchemaType(DemoSchemaType.Sakila)

const sakilaBackground = lines([
  `The ${sakilaName} sample database schema and data were created by Mike Hillyer with the MySQL AB documentation team and is available at https://dev.mysql.com/doc/index-other.html.`,
])
