import { lines } from '@src/core/codegen'
import { caseByDbCaseStyle, DbCaseStyle, DbOptions } from '@src/core/database'
import { DataType, DataTypeType, Field, isDateTimeType, isIntegerType } from '@src/core/schema'
import { camelCase } from '@src/utils/string'
import { displaySequelizeDataType, sequelizeUuidVersion } from './dataTypes'
import { noSupportedDetails, notSupportedComment } from './helpers'

type FieldTemplateArgs = {
  field: Field
  dbOptions: DbOptions
  define?: boolean
}
export function fieldTemplate({ field, dbOptions, define }: FieldTemplateArgs): string {
  const comment = notSupportedComment(field.type, dbOptions.sqlDialect)

  return lines([
    noSupportedDetails(field.type, dbOptions.sqlDialect),
    `${comment}${camelCase(field.name)}: {`,
    lines(fieldOptions({ field, dbOptions, define }), {
      depth: 2,
      separator: ',',
      prefix: comment,
    }),
    `${comment}}`,
  ])
}

type FieldOptionsArgs = {
  field: Field
  dbOptions: DbOptions
  define?: boolean
}

function fieldOptions({
  field: { name, type, required, primaryKey, unique },
  define,
  dbOptions: { caseStyle },
}: FieldOptionsArgs): (string | null)[] {
  return [
    typeField(type),
    defineField(name, caseStyle, define),
    primaryKeyField(primaryKey),
    autoincrementField(type),
    allowNullField(required),
    uniqueField(unique),
    defaultField(type),
  ]
}

function typeField(dataType: DataType): string {
  return `type: ${displaySequelizeDataType(dataType)}`
}

function defineField(name: string, caseStyle: DbCaseStyle, define?: boolean): string | null {
  return define ? `field: '${caseByDbCaseStyle(name, caseStyle)}'` : null
}

function allowNullField(required?: boolean): string | null {
  return required === undefined ? null : `allowNull: ${!required}`
}

function primaryKeyField(primaryKey?: boolean): string | null {
  return primaryKey ? `primaryKey: ${primaryKey}` : null
}

function uniqueField(unique?: boolean): string | null {
  return unique === undefined ? null : `unique: ${unique}`
}

function autoincrementField(dataType: DataType): string | null {
  return isIntegerType(dataType) && dataType.autoincrement !== undefined
    ? `autoIncrement: ${dataType.autoincrement}`
    : null
}

function defaultField(dataType: DataType) {
  if (isDateTimeType(dataType) && dataType.defaultNow) {
    return `defaultValue: DataTypes.NOW`
  }

  if (dataType.type === DataTypeType.Uuid && dataType.defaultVersion) {
    return `defaultValue: ${sequelizeUuidVersion(dataType.defaultVersion)}`
  }

  return null
}
