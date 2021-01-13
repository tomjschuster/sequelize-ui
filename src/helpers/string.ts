import { plural, singular } from 'pluralize'
import { camelCase } from 'camel-case'

export function pluralize(value: string): string {
  return plural(value)
}

export function singularize(value: string): string {
  return singular(value)
}

export function camelize(value: string): string {
  return camelCase(value)
}
