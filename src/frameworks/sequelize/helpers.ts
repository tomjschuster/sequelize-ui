import { DbCaseStyle, DbOptions, SqlDialect } from '@src/core/database'
import { DataTypeType, Field, Model } from '@src/core/schema'
import { camelCase, pascalCase, singular, snakeCase } from '@src/utils/string'
import shortid from 'shortid'

export function modelName({ name }: Model): string {
  return singular(pascalCase(name))
}

type GetFieldsWithIdArgs = {
  model: Model
  dbOptions: DbOptions
}
export function getFieldsWithPk({ model, dbOptions }: GetFieldsWithIdArgs): Field[] {
  const pks = model.fields.filter((f) => f.primaryKey)

  // Don't apply any prefixes if pk is composite
  if (pks.length > 1) return model.fields
  // Add explicit pk field for TypeScript classes
  if (pks.length === 0) return [idField({ model, dbOptions }), ...model.fields]
  // Prefix pk with model name if pk is standard  format and prefixPk option is true
  return model.fields.map((field) => prefixPk({ field, model, dbOptions }))
}

type PrefixPkArgs = {
  field: Field
  model: Model
  dbOptions: DbOptions
}
function prefixPk({ field, model, dbOptions }: PrefixPkArgs): Field {
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
const idField = ({ model, dbOptions }: IdFieldArgs): Field => ({
  id: shortid(),
  name: getPkName({ model, dbOptions }),
  type: { type: DataTypeType.Integer },
  primaryKey: true,
  generated: true,
})

type GetPkNameArgs = {
  model: Model
  dbOptions: DbOptions
}
const getPkName = ({ model, dbOptions }: GetPkNameArgs): string => {
  if (!dbOptions.prefixPks) return 'id'
  const prefix =
    dbOptions.caseStyle === DbCaseStyle.Snake ? snakeCase(model.name) : camelCase(model.name)
  return dbOptions.caseStyle === DbCaseStyle.Snake ? `${prefix}_id` : `${prefix}Id`
}

export function pkIsDefault(field: Field): boolean {
  return !!field.primaryKey && snakeCase(field.name) === 'id' && !!field.generated
}

export function hasJsonType(model: Model): boolean {
  return model.fields.some((f) => f.type.type === DataTypeType.Json)
}

export function sqlDialiectConfigValue(dialect: SqlDialect): string {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'mariadb'
    case SqlDialect.MsSql:
      return 'mssql'
    case SqlDialect.MySql:
      return 'mysql'
    case SqlDialect.Postgres:
      return 'postgres'
    case SqlDialect.Sqlite:
      return 'sqlite'
  }
}
