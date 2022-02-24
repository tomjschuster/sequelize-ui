import { Schema as JtdSchema, validate } from 'jtd'
import { UserPreferences } from '../../api'
import { UserPreferencesV1 } from './v1'
import v1JtdSchema from './v1/schema.jtd.json'
import { fromV1 } from './v1/translate'

export function parseUserPreferences(userPreferences: unknown): Promise<UserPreferences> {
  return parseV1(userPreferences)
}

export async function parseV1(userPreferences: unknown): Promise<UserPreferences> {
  const errors = validate(v1JtdSchema as JtdSchema, userPreferences)
  if (errors.length > 0) return await Promise.reject(errors)
  return fromV1(userPreferences as UserPreferencesV1)
}
