import { DbOptions, defaultDbOptions } from '@src/core/database'
import { get, lsKey, remove, set } from '@src/utils/localStorage'
import { UserPreferences, UserPreferencesApi } from '../../api'
import { parseUserPreferences } from './parse'
import { toV1 } from './v1/translate'

export default class LocalStorageUserPreferencesApi implements UserPreferencesApi {
  async getDefaultDbOptions(): Promise<DbOptions> {
    try {
      const userPreferences = await getUserPreferences()
      return userPreferences ? userPreferences.defaultDbOptions : defaultDbOptions
    } catch (e) {
      console.error(e)
      this.clearPreferences()
      return defaultDbOptions
    }
  }
  async updateDefaultDbOptions(defaultDbOptions: DbOptions): Promise<DbOptions> {
    await setUserPreferences({ defaultDbOptions })
    return defaultDbOptions
  }

  async clearPreferences(): Promise<void> {
    remove(userPreferencesKey())
  }
}

function userPreferencesKey(): string {
  return lsKey('userPreferences')
}

async function setUserPreferences(userPreferences: UserPreferences): Promise<void> {
  const payload = toV1(userPreferences)
  return set(userPreferencesKey(), payload)
}

async function getUserPreferences(): Promise<UserPreferences | null> {
  const data = get(userPreferencesKey())
  return data ? await parseUserPreferences(data) : null
}
