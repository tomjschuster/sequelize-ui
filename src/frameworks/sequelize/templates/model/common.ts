import { displaySqlDialect, SqlDialect } from '@src/core/database'
import { Association, DataType, Model } from '@src/core/schema'
import { dataTypeNotSupported, displaySequelizeDataType } from '../../dataTypes'

export type ModelAssociation = {
  model: Model
  association: Association
}

export function notSupportedComment(type: DataType, dialect: SqlDialect): string {
  return dataTypeNotSupported(type, dialect) ? '// ' : ''
}

export function noSupportedDetails(type: DataType, dialect: SqlDialect): string | null {
  if (!dataTypeNotSupported(type, dialect)) return null

  const typeDisplay = displaySequelizeDataType(type)
  return `//// ${typeDisplay} not supported for ${displaySqlDialect(dialect)}`
}
