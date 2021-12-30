import { License } from '@src/core/oss/license'
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
