import {
  DbOptionsCaseStyle,
  DbOptionsNounForm,
  DbOptionsSqlDialect,
  UserPreferencesV1,
} from '../v1'

export const userPreferencesV1: UserPreferencesV1 = {
  defaultDbOptions: {
    sqlDialect: DbOptionsSqlDialect.Mariadb,
    caseStyle: DbOptionsCaseStyle.Camel,
    nounForm: DbOptionsNounForm.Plural,
    migrations: true,
    timestamps: false,
    prefixPks: false,
  },
}
