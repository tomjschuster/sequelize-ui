import { Schema } from '@src/core/schema'

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

export async function getDemoSchema(type: DemoSchemaType): Promise<Schema> {
  switch (type) {
    case DemoSchemaType.Blog: {
      return (await import('./blog')).default
    }
    case DemoSchemaType.Employee: {
      return (await import('./employee')).default
      // return (await import('./employee')).default
    }
    case DemoSchemaType.Sakila: {
      return (await import('./sakila')).default
    }
  }
}
