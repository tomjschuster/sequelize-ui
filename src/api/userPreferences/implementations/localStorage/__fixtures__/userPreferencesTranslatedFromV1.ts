import { UserPreferences } from '@src/api/userPreferences/api'
import { DbCaseStyle, DbNounForm, SqlDialect } from '@src/core/database'

export const userPreferencesTranslatedFromV1: UserPreferences = {
  defaultDbOptions: {
    sqlDialect: SqlDialect.MariaDb,
    caseStyle: DbCaseStyle.Camel,
    nounForm: DbNounForm.Plural,
    migrations: true,
    timestamps: false,
    prefixPks: false,
  },
}
