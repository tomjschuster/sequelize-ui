import { License, licenseTitle, licenseUrl } from '@src/core/oss/license'
import * as Ids from './schema/examples/ids'

export type SchemaMeta = {
  schemaId: string
  isExample: boolean
  displayName: string
  description: string[]
  slug: string
  license: License
  source: string
  icon: SchemaIconType
}

export enum SchemaIconType {
  Rss = 'rss',
  UserGroup = 'user-group',
  Film = 'film',
  AcademicCap = 'academic-cap',
}

export function getSchemaMetaById(id: string): SchemaMeta | null {
  const type = getExampleSchemaTypeById(id)
  if (!type) return null
  return getExampleSchemaMetaByType(type)
}

export function getSchemaMetaBySlug(slug: string): SchemaMeta | null {
  const type = getExampleSchemaTypeBySlug(slug)
  if (!type) return null
  return getExampleSchemaMetaByType(type)
}

export function getExampleSchemaMeta(): SchemaMeta[] {
  return Object.values(ExampleSchemaType)
    .map(getExampleSchemaMetaByType)
    .filter((meta): meta is SchemaMeta => !!meta)
}

enum ExampleSchemaType {
  Blog = 'blog',
  Employees = 'employee',
  Sakila = 'sakila',
  StudentInfoSystem = 'sstudent information system',
}

function getExampleSchemaMetaByType(type: ExampleSchemaType): SchemaMeta {
  return {
    schemaId: getExampleSchemaIdByType(type),
    isExample: true,
    displayName: displayExampleSchemaType(type),
    description: exampleSchemaDescription(type),
    slug: getExampleSchemaSlug(type),
    license: getExampleSchemaLicense(type),
    source: getExampleSchemaSource(type),
    icon: getExampleSchemaIcon(type),
  }
}

function getExampleSchemaTypeById(id: string): ExampleSchemaType | undefined {
  switch (id) {
    case Ids.BLOG_ID:
      return ExampleSchemaType.Blog
    case Ids.EMPLOYEES_ID:
      return ExampleSchemaType.Employees
    case Ids.SAKILA_ID:
      return ExampleSchemaType.Sakila
    case Ids.STUDENT_INFO_SYSTEM_ID:
      return ExampleSchemaType.StudentInfoSystem
    default:
      return undefined
  }
}

function getExampleSchemaIdByType(type: ExampleSchemaType): string {
  switch (type) {
    case ExampleSchemaType.Blog:
      return Ids.BLOG_ID
    case ExampleSchemaType.Employees:
      return Ids.EMPLOYEES_ID
    case ExampleSchemaType.Sakila:
      return Ids.SAKILA_ID
    case ExampleSchemaType.StudentInfoSystem:
      return Ids.STUDENT_INFO_SYSTEM_ID
  }
}

const BLOG_SLUG = 'blog'
const EMPLOYEES_SLUG = 'employees'
const SAKILA_SLUG = 'sakila'
const STUDENT_INFO_SYSTEM_SLUG = 'student-info-system'

function getExampleSchemaTypeBySlug(slug: string): ExampleSchemaType | undefined {
  switch (slug) {
    case BLOG_SLUG:
      return ExampleSchemaType.Blog
    case EMPLOYEES_SLUG:
      return ExampleSchemaType.Employees
    case SAKILA_SLUG:
      return ExampleSchemaType.Sakila
    case STUDENT_INFO_SYSTEM_SLUG:
      return ExampleSchemaType.StudentInfoSystem
  }
}

function displayExampleSchemaType(type: ExampleSchemaType): string {
  switch (type) {
    case ExampleSchemaType.Blog:
      return 'Blog'
    case ExampleSchemaType.Employees:
      return 'Employees'
    case ExampleSchemaType.Sakila:
      return 'Sakila'
    case ExampleSchemaType.StudentInfoSystem:
      return 'Student Info System'
  }
}

function exampleSchemaDescription(schemaType: ExampleSchemaType): string[] {
  const name = displayExampleSchemaType(schemaType)
  const license = getExampleSchemaLicense(schemaType)
  const source = getExampleSchemaSource(schemaType)
  const sequelizeConversion = sequelizeConversionCopy(source)
  const licenseCopy = `under the [${licenseTitle(license)} License](${licenseUrl(license)})`

  switch (schemaType) {
    case ExampleSchemaType.Blog:
      return [
        `The ${name} sample database is a schema for blogging website with users, posts, comments, tags and categories.`,
        `The schema was created by Bhagwat Singh Chouhan with Tutorials24x7 ${licenseCopy} and is available at <https://github.com/tutorials24x7/blog-database-mysql>.`,
        sequelizeConversion,
      ]
    case ExampleSchemaType.Employees:
      return [
        `The ${name} sample database is a temporal database for tracking salary, title and department for a company's employees over time.`,
        `The schema was created by Fusheng Wang and Carlo Zaniolo ${licenseCopy} and is available XML format at <http://timecenter.cs.aau.dk/software.htm>.`,
        'The relational schema for this data was created by Giuseppe Maxia and the data was converted from XML to relational by Patrick Crews. The schema and data are available at <https://github.com/datacharmer/test_db>.',
        sequelizeConversion,
      ]
    case ExampleSchemaType.Sakila:
      return [
        `The ${name} sample database is a schema for a video rental store commonly used as an example database for SQL tutorials.`,
        `The schema and data were created by Mike Hillyer with the MySQL AB documentation team ${licenseCopy} and is available at <https://dev.mysql.com/doc/index-other.html>.`,
        sequelizeConversion,
      ]
    case ExampleSchemaType.StudentInfoSystem:
      return [
        `The ${name} sample database is a simple schema for a student information system with students, teachers and courses.`,
        `The schema was created by Tom Schuster ${licenseCopy}.`,
      ]
  }
}

function sequelizeConversionCopy(source: string): string {
  return `The schema was converted to TypeScript for Sequelize UI by Tom Schuster and is available at <${source}>.`
}

function getExampleSchemaSlug(type: ExampleSchemaType): string {
  switch (type) {
    case ExampleSchemaType.Blog:
      return BLOG_SLUG
    case ExampleSchemaType.Employees:
      return EMPLOYEES_SLUG
    case ExampleSchemaType.Sakila:
      return SAKILA_SLUG
    case ExampleSchemaType.StudentInfoSystem:
      return STUDENT_INFO_SYSTEM_SLUG
  }
}

function getExampleSchemaLicense(type: ExampleSchemaType): License {
  switch (type) {
    case ExampleSchemaType.Blog:
      return License.Mit
    case ExampleSchemaType.Employees:
      return License.CcBySa3
    case ExampleSchemaType.Sakila:
      return License.NewBsd
    case ExampleSchemaType.StudentInfoSystem:
      return License.NewBsd
  }
}

function getExampleSchemaSource(schemaType: ExampleSchemaType): string {
  switch (schemaType) {
    case ExampleSchemaType.Blog:
      return 'https://github.com/tomjschuster/sequelize-ui-ts/blob/main/src/api/schema/examples/sakila.ts'
    case ExampleSchemaType.Employees:
      return 'https://github.com/tomjschuster/sequelize-ui-ts/blob/main/src/api/schema/examples/employees.ts'
    case ExampleSchemaType.Sakila:
      return 'https://github.com/tomjschuster/sequelize-ui-ts/blob/main/src/api/schema/examples/sakila.ts'
    case ExampleSchemaType.StudentInfoSystem:
      return 'https://github.com/tomjschuster/sequelize-ui-ts/blob/main/src/api/schema/examples/studentInfoSystem.ts'
  }
}

function getExampleSchemaIcon(schemaType: ExampleSchemaType): SchemaIconType {
  switch (schemaType) {
    case ExampleSchemaType.Blog:
      return SchemaIconType.Rss
    case ExampleSchemaType.Employees:
      return SchemaIconType.UserGroup
    case ExampleSchemaType.Sakila:
      return SchemaIconType.Film
    case ExampleSchemaType.StudentInfoSystem:
      return SchemaIconType.AcademicCap
  }
}
