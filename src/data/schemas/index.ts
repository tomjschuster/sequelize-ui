import { Schema } from '@src/core/schema'
import { default as employee } from './employeeTemporalDataSet'
import { default as sakila } from './sakila'

export enum DemoSchemaType {
  Sakila = 'sakila',
  Employee = 'employee',
}

export function getDemoSchema(type?: DemoSchemaType): Schema {
  switch (type) {
    case DemoSchemaType.Employee:
      return employee
    case DemoSchemaType.Sakila:
      return sakila
    default:
      return sakila
  }
}

export function displayDemoSchemaType(type: DemoSchemaType): string {
  switch (type) {
    case DemoSchemaType.Employee:
      return 'Temporal Employee Data Set'
    case DemoSchemaType.Sakila:
      return 'Sakila'
  }
}
