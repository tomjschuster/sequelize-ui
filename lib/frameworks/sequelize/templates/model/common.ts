import { Association, DataType, displaySqlDialect, Model, SqlDialect } from '@lib/core'
import {
  dataTypeNotSupported,
  dataTypeToSequelize,
  displaySequelizeDataType,
} from '../../dataTypes'

export type ModelAssociation = {
  model: Model
  association: Association
}

export const notSupportedComment = (type: DataType, dialect: SqlDialect): string =>
  dataTypeNotSupported(type, dialect) ? '// ' : ''

export const noSupportedDetails = (type: DataType, dialect: SqlDialect): string | null => {
  if (!dataTypeNotSupported(type, dialect)) return null

  const typeDisplay = displaySequelizeDataType(dataTypeToSequelize(type))
  return `//// ${typeDisplay} not supported for ${displaySqlDialect(dialect)}`
}
