import { Schema } from '@src/core/schema'
import * as DemoSchemaIds from './demoSchemaIds'

export function isDemoSchema(schema: Schema): boolean {
  return !!getDemoSchemaType(schema.id)
}

export function getDemoSchemaType(id: string): DemoSchemaType | undefined {
  switch (id) {
    case DemoSchemaIds.DEMO_SCHEMA_BLOG_ID:
      return DemoSchemaType.Blog
    case DemoSchemaIds.DEMO_SCHEMA_EMPLOYEE_ID:
      return DemoSchemaType.Employee
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
    case DemoSchemaType.Employee:
      return DemoSchemaIds.DEMO_SCHEMA_EMPLOYEE_ID
    case DemoSchemaType.Sakila:
      return DemoSchemaIds.DEMO_SCHEMA_SAKILA_ID
  }
}

export enum DemoSchemaType {
  Blog = 'blog',
  Employee = 'employee',
  Sakila = 'sakila',
}

export function displayDemoSchemaType(type: DemoSchemaType): string {
  switch (type) {
    case DemoSchemaType.Blog:
      return 'Blog'
    case DemoSchemaType.Employee:
      return 'Employee Dataset'
    case DemoSchemaType.Sakila:
      return 'Sakila'
  }
}

export async function getDemoSchema(type: DemoSchemaType | undefined): Promise<Schema | undefined> {
  switch (type) {
    case DemoSchemaType.Blog: {
      return (await import('./blog')).default
    }
    case DemoSchemaType.Employee: {
      return (await import('./employee')).default
    }
    case DemoSchemaType.Sakila: {
      return (await import('./sakila')).default
    }
    default:
      return Promise.resolve(undefined)
  }
}
