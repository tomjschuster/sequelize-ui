import { DbOptions, nounFormByDbNounForm, tableCaseByDbCaseStyle } from '@src/core/database'
import { Model } from '@src/core/schema'

type DbTableNameArgs = {
  model: Model
  dbOptions: DbOptions
}
export function dbTableName({ model, dbOptions }: DbTableNameArgs): string {
  const casedName = tableCaseByDbCaseStyle(model.name, dbOptions.caseStyle)
  return nounFormByDbNounForm(casedName, dbOptions.nounForm)
}
