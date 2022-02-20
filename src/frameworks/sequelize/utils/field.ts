import { lines } from '@src/core/codegen'
import { caseByDbCaseStyle, DbCaseStyle, DbOptions } from '@src/core/database'
import {
  DataType,
  DataTypeType,
  dateTimeDataType,
  Field,
  integerDataType,
  isDateTimeType,
  isIntegerType,
  Model,
} from '@src/core/schema'
import { camelCase, snakeCase, uniqueId } from '@src/utils/string'
import {
  displaySequelizeDataType,
  noSupportedDetails,
  notSupportedComment,
  sequelizeUuidVersion,
} from './dataTypes'

export type SequelizeField = Field & { generated?: boolean }

export function pkIsDefault(field: SequelizeField): boolean {
  return !!field.primaryKey && snakeCase(field.name) === 'id' && !!field.generated
}

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
  return required ? `allowNull: ${!required}` : null
}

function primaryKeyField(primaryKey?: boolean): string | null {
  return primaryKey ? 'primaryKey: true' : null
}

function uniqueField(unique?: boolean): string | null {
  return unique ? 'unique: true' : null
}

function autoincrementField(dataType: DataType): string | null {
  return isIntegerType(dataType) && dataType.autoincrement
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

type PrefixPkArgs = {
  field: Field
  model: Model
  dbOptions: DbOptions
}
export function prefixPk({ field, model, dbOptions }: PrefixPkArgs): SequelizeField {
  if (dbOptions.prefixPks === null || !field.primaryKey) return field

  const name = snakeCase(field.name)
  const isStandard = name === 'id' || name === snakeCase(`${model.name}_id`)
  if (!isStandard) return field

  return { ...field, name: getPkName({ model, dbOptions }) }
}

type IdFieldArgs = {
  model: Model
  dbOptions: DbOptions
}
export function idField({ model, dbOptions }: IdFieldArgs): SequelizeField {
  return {
    id: uniqueId(),
    name: getPkName({ model, dbOptions }),
    type: integerDataType({ autoincrement: true, unsigned: true }),
    primaryKey: true,
    required: true,
    unique: false,
    generated: true,
  }
}

type GetPkNameArgs = {
  model: Model
  dbOptions: DbOptions
}
export function getPkName({ model, dbOptions }: GetPkNameArgs): string {
  if (!dbOptions.prefixPks) return 'id'
  return caseByDbCaseStyle(`${model.name} id`, dbOptions.caseStyle)
}

type GetTimestampFieldsTemplateArgs = {
  dbOptions: DbOptions
}
export function getTimestampFields({ dbOptions }: GetTimestampFieldsTemplateArgs): Field[] {
  if (!dbOptions.timestamps) return []
  const createdAt: Field = {
    id: uniqueId(),
    name: caseByDbCaseStyle('created at', dbOptions.caseStyle),
    type: dateTimeDataType(),
    primaryKey: false,
    required: false,
    unique: false,
  }

  const updatedAt: Field = {
    id: uniqueId(),
    name: caseByDbCaseStyle('updated at', dbOptions.caseStyle),
    type: dateTimeDataType(),
    primaryKey: false,
    required: false,
    unique: false,
  }

  return [createdAt, updatedAt]
}
