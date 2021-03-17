import { Schema } from '@lib/core'
import { default as employee } from './employeeTemporalDataSet'
import { default as sakila } from './sakila'

export enum DemoSchemaType {
  Employee = 'employee',
  Sakila = 'sakila',
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
