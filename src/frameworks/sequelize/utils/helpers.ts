import {
  DbOptions,
  displaySqlDialect,
  nounFormByDbNounForm,
  SqlDialect,
  tableCaseByDbCaseStyle,
} from '@src/core/database'
import { DataType, Field, Model } from '@src/core/schema'
import { snakeCase } from '@src/utils/string'
import { dataTypeNotSupported, displaySequelizeDataType } from './dataTypes'

export function pkIsDefault(field: Field): boolean {
  return !!field.primaryKey && snakeCase(field.name) === 'id' && !!field.generated
}

type DbTableNameArgs = {
  model: Model
  dbOptions: DbOptions
}
export function dbTableName({ model, dbOptions }: DbTableNameArgs): string {
  const casedName = tableCaseByDbCaseStyle(model.name, dbOptions.caseStyle)
  return nounFormByDbNounForm(casedName, dbOptions.nounForm)
}

export function notSupportedComment(type: DataType, dialect: SqlDialect): string {
  return dataTypeNotSupported(type, dialect) ? '// ' : ''
}

export function noSupportedDetails(type: DataType, dialect: SqlDialect): string | null {
  if (!dataTypeNotSupported(type, dialect)) return null

  const typeDisplay = displaySequelizeDataType(type)
  return `//// ${typeDisplay} not supported for ${displaySqlDialect(dialect)}`
}
