import {
  DbCaseStyle,
  DbNounForm,
  DbOptions,
  defaultDbOptions,
  SqlDialect,
} from '@src/core/database'
import LocalStorageSchemaApi from '..'

const userPreferencesApi = new LocalStorageSchemaApi()

describe('userPreferences api', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('getDefaultDbOptions', () => {
    it('should return default options when none are found', async () => {
      await expect(userPreferencesApi.getDefaultDbOptions()).resolves.toEqual(defaultDbOptions)
    })

    it('should return persisted options', async () => {
      const customOptions: DbOptions = {
        ...defaultDbOptions,
        sqlDialect: SqlDialect.MsSql,
        prefixPks: true,
        caseStyle: DbCaseStyle.Camel,
        nounForm: DbNounForm.Singular,
      }
      await userPreferencesApi.updateDefaultDbOptions(customOptions)
      await expect(userPreferencesApi.getDefaultDbOptions()).resolves.toEqual(customOptions)
    })
  })
})
