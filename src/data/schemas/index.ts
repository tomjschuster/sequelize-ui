import { Schema } from '@src/core/schema'

export enum DemoSchemaType {
  Blog = 'blog',
  EmployeeTemporalDataset = 'employeeTemporalDataset',
  Sakila = 'sakila',
}

export function displayDemoSchemaType(type: DemoSchemaType): string {
  switch (type) {
    case DemoSchemaType.Blog:
      return 'Blog'
    case DemoSchemaType.EmployeeTemporalDataset:
      return 'Employee Temporal Data Set'
    case DemoSchemaType.Sakila:
      return 'Sakila'
  }
}

export async function getDemoSchema(type: DemoSchemaType): Promise<Schema> {
  switch (type) {
    case DemoSchemaType.Blog: {
      return (await import('./blog')).default
    }
    case DemoSchemaType.EmployeeTemporalDataset: {
      return (await import('./employeeTemporalDataset')).default
    }
    case DemoSchemaType.Sakila: {
      return (await import('./sakila')).default
    }
  }
}
