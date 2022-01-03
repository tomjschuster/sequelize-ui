import { License, licenseTitle } from '@src/core/oss/license'
import { Schema } from '@src/core/schema'
import * as DemoSchemaIds from './demoSchemaIds'

export function isDemoSchema(schema: Schema): boolean {
  return !!getDemoSchemaTypeById(schema.id)
}

export function isForkedFromDemoSchema(schema: Schema): boolean {
  if (!schema.forkedFrom) return false
  return !!getDemoSchemaTypeById(schema.forkedFrom)
}

export function getDemoSchemaTypeById(id: string): DemoSchemaType | undefined {
  switch (id) {
    case DemoSchemaIds.DEMO_SCHEMA_BLOG_ID:
      return DemoSchemaType.Blog
    case DemoSchemaIds.DEMO_SCHEMA_EMPLOYEE_ID:
      return DemoSchemaType.Employees
    case DemoSchemaIds.DEMO_SCHEMA_SAKILA_ID:
      return DemoSchemaType.Sakila
    default:
      return undefined
  }
}

export function getDemoSchemaId(type: DemoSchemaType): string {
  switch (type) {
    case DemoSchemaType.Blog:
      return DemoSchemaIds.DEMO_SCHEMA_BLOG_ID
    case DemoSchemaType.Employees:
      return DemoSchemaIds.DEMO_SCHEMA_EMPLOYEE_ID
    case DemoSchemaType.Sakila:
      return DemoSchemaIds.DEMO_SCHEMA_SAKILA_ID
  }
}

export enum DemoSchemaType {
  Blog = 'blog',
  Employees = 'employee',
  Sakila = 'sakila',
}

export function displayDemoSchemaType(type: DemoSchemaType): string {
  switch (type) {
    case DemoSchemaType.Blog:
      return 'Blog'
    case DemoSchemaType.Employees:
      return 'Employees'
    case DemoSchemaType.Sakila:
      return 'Sakila'
  }
}

const BLOG_SLUG = 'blog'
const EMPLOYEES_SLUG = 'employees'
const SAKILA = 'sakila'

export function getDemoSchemaSlug(type: DemoSchemaType): string {
  switch (type) {
    case DemoSchemaType.Blog:
      return BLOG_SLUG
    case DemoSchemaType.Employees:
      return EMPLOYEES_SLUG
    case DemoSchemaType.Sakila:
      return SAKILA
  }
}

export function getDemoSchemaTypeBySlug(slug: string): DemoSchemaType | undefined {
  switch (slug) {
    case BLOG_SLUG:
      return DemoSchemaType.Blog
    case EMPLOYEES_SLUG:
      return DemoSchemaType.Employees
    case SAKILA:
      return DemoSchemaType.Sakila
  }
}

export async function getDemoSchema(type: DemoSchemaType | undefined): Promise<Schema | undefined> {
  switch (type) {
    case DemoSchemaType.Blog: {
      return (await import('./blog')).default
    }
    case DemoSchemaType.Employees: {
      return (await import('./employee')).default
    }
    case DemoSchemaType.Sakila: {
      return (await import('./sakila')).default
    }
    default:
      return Promise.resolve(undefined)
  }
}

export function getDemoSchemaLicense(type: DemoSchemaType): License {
  switch (type) {
    case DemoSchemaType.Blog:
      return License.Mit
    case DemoSchemaType.Employees:
      return License.CcBySa3
    case DemoSchemaType.Sakila:
      return License.NewBsd
  }
}

export type SampleSchemaBackgroundCopy = {
  description: string
  attribution: string
  license: string
}

export function sampleSchemaDescription(demoSchemaType: DemoSchemaType): string[] {
  const name = displayDemoSchemaType(demoSchemaType)
  const license = getDemoSchemaLicense(demoSchemaType)

  switch (demoSchemaType) {
    case DemoSchemaType.Blog:
      return [
        `The ${name} sample database schema was created by Bhagwat Singh Chouhan with Tutorials24x7 and is available at https://github.com/tutorials24x7/blog-database-mysql.`,
        licenseCopy(
          license,
          'https://github.com/tomjschuster/sequelize-ui-ts/blob/main/src/data/employee/empllyee.ts',
        ),
      ]
    case DemoSchemaType.Employees:
      return [
        `The ${name} sample database schema was created by Fusheng Wang and Carlo Zaniolo and is available XML format at http://timecenter.cs.aau.dk/software.htm.`,
        'The relational schema for this data was created by Giuseppe Maxia and the data was converted from XML to relational by Patrick Crews. The schema and data are available at https://github.com/datacharmer/test_db.',
        licenseCopy(
          license,
          'https://github.com/tomjschuster/sequelize-ui-ts/blob/main/src/data/employee/sakila.ts',
        ),
      ]
    case DemoSchemaType.Sakila:
      return [
        `The ${name} sample database is a schema for a video rental store commonly used as an example database for SQL tutorials.`,
        `The schema and data were created by Mike Hillyer with the MySQL AB documentation team and is available at https://dev.mysql.com/doc/index-other.html.`,
        licenseCopy(
          license,
          'https://github.com/tomjschuster/sequelize-ui-ts/blob/main/src/data/schemas/sakila.ts',
        ),
      ]
  }
}

export function licenseCopy(license: License, url: string): string {
  const title = licenseTitle(license)
  return `The schema was converted to TypeScript for Sequelize UI by Tom Schuster and is licensed under the [${title} license](${url}).`
}
