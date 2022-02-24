import { DbOptions } from '@src/core/database'

export type UserPreferences = {
  defaultDbOptions: DbOptions
}

export interface UserPreferencesApi {
  getDefaultDbOptions: () => Promise<DbOptions>
  updateDefaultDbOptions: (dbOptions: DbOptions) => Promise<DbOptions>
  clearPreferences: () => Promise<void>
}
