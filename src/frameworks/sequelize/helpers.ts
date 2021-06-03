import {
  caseByDbCaseStyle,
  DbOptions,
  nounFormByDbNounForm,
  SqlDialect,
  tableCaseByDbCaseStyle,
} from '@src/core/database'
import {
  Association,
  associationTypeIsSingular,
  AssociationTypeType,
  DataTypeType,
  dateTimeDataType,
  Field,
  Model,
  Schema,
  typeWithoutOptions,
} from '@src/core/schema'
import { arrayToLookup, dedupBy } from '@src/utils/array'
import { camelCase, namesEq, pascalCase, plural, singular, snakeCase } from '@src/utils/string'
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
export function prefixPk({ field, model, dbOptions }: PrefixPkArgs): Field {
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
export const idField = ({ model, dbOptions }: IdFieldArgs): Field => ({
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
  return caseByDbCaseStyle(`${model.name} id`, dbOptions.caseStyle)
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

type AssociationNameArgs = {
  association: Association
  targetModel: Model
}
export function associationName({ association, targetModel }: AssociationNameArgs): string {
  const name = association.alias ? camelCase(association.alias) : modelName(targetModel)
  return associationTypeIsSingular(association.type) ? singular(name) : plural(name)
}

// TODO: Save schema create date and use as start date
const migrationStartDateNumber = parseInt(
  new Date()
    .toISOString()
    .split('.')[0]
    .replace(/[^0-9]/g, ''),
)

type MigrationCreateFileNameArgs = {
  model: Model
  dbOptions: DbOptions
  index: number
}
export function migrationCreateFilename({
  model,
  dbOptions,
  index,
}: MigrationCreateFileNameArgs): string {
  return `${migrationStartDateNumber + index}-create-${dbTableName({ model, dbOptions })}.js`
}

export function migrationForeignKeysFilename(index: number): string {
  return `${migrationStartDateNumber + index}-add-foreign-keys.js`
}

type DbTableNameArgs = {
  model: Model
  dbOptions: DbOptions
}

export function dbTableName({ model, dbOptions }: DbTableNameArgs): string {
  const casedName = tableCaseByDbCaseStyle(model.name, dbOptions.caseStyle)
  return nounFormByDbNounForm(casedName, dbOptions.nounForm)
}

type GetTimestampFieldsTemplateArgs = {
  dbOptions: DbOptions
}
export function getTimestampFields({ dbOptions }: GetTimestampFieldsTemplateArgs): Field[] {
  if (!dbOptions.timestamps) return []
  const createdAt: Field = {
    id: shortid(),
    name: caseByDbCaseStyle('created at', dbOptions.caseStyle),
    type: dateTimeDataType(),
  }

  const updatedAt: Field = {
    id: shortid(),
    name: caseByDbCaseStyle('updated at', dbOptions.caseStyle),
    type: dateTimeDataType(),
  }

  return [createdAt, updatedAt]
}

export type Reference = {
  table: string
  column: string
}

type GetDbColumnFieldsArgs = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}
export function getDbColumnFields({
  model,
  schema,
  dbOptions,
}: GetDbColumnFieldsArgs): [Field, Reference | null][] {
  const fieldsWithPk = getFieldsWithPk({ model, dbOptions })
  const timestampFields = getTimestampFields({ dbOptions }).filter(
    (field) => !fieldsWithPk.some((f) => namesEq(field.name, f.name)),
  )
  const fields = fieldsWithPk.concat(timestampFields)
  const modelWithFields: Model = { ...model, fields }
  const fkFields = getFkFields({ model: modelWithFields, schema, dbOptions })

  return fields
    .map<[Field, Reference | null]>((field) => {
      const fr = fkFields.find(([f]) => namesEq(field.name, f.name))
      if (!fr) return [field, null]
      return [field, fr[1]]
    })
    .concat(fkFields.filter(([field]) => !fields.some((f) => namesEq(field.name, f.name))))
}

type GetFkFieldsArgs = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}

function getFkFields({ model, schema, dbOptions }: GetFkFieldsArgs): [Field, Reference][] {
  const modelById = arrayToLookup<Model>(schema.models, (m) => m.id)
  const sourceFields = model.associations
    .filter((a) => a.type.type === AssociationTypeType.BelongsTo)
    .map<[Field, Reference] | null>((association) => {
      const fk = getForeignKey({ model, association, modelById, dbOptions })

      const target = modelById[association.targetModelId]
      if (!target) {
        console.error(
          `Target model ${association.targetModelId} not found from model ${model.name}`,
        )
        return null
      }

      const targetPk =
        target.fields.find((field) => field.primaryKey) || idField({ model: target, dbOptions })
      const table = dbTableName({ model: target, dbOptions })
      const column = prefixPk({ field: targetPk, model: target, dbOptions }).name
      const field = { id: shortid(), name: fk, type: typeWithoutOptions(targetPk.type) }

      return [field, { table, column }]
    })
    .filter((fr): fr is [Field, Reference] => !!fr)

  const targetFields = schema.models
    .flatMap((m) => m.associations)
    .filter(
      (a) =>
        (a.type.type === AssociationTypeType.HasOne ||
          a.type.type === AssociationTypeType.HasMany) &&
        a.targetModelId === model.id,
    )
    .map<[Field, Reference] | null>((association) => {
      const source = modelById[association.sourceModelId]
      if (!source) {
        console.error(
          `Target model ${association.sourceModelId} not found from model ${model.name}`,
        )
        return null
      }

      const fk = getForeignKey({ model: source, association, modelById, dbOptions })

      const sourcePk =
        source.fields.find((field) => field.primaryKey) || idField({ model: source, dbOptions })
      const table = dbTableName({ model: source, dbOptions })
      const column = prefixPk({ field: sourcePk, model: source, dbOptions }).name
      const field = { id: shortid(), name: fk, type: typeWithoutOptions(sourcePk.type) }

      return [field, { table, column }]
    })
    .filter((fr): fr is [Field, Reference] => !!fr)

  return dedupBy<[Field, Reference]>(sourceFields.concat(targetFields), ([field]) => field.name)
}

type ModelById = Record<string, Model>

type GetForeignKeyArgs = {
  model: Model
  association: Association
  modelById: ModelById
  dbOptions: DbOptions
}
export function getForeignKey({
  model,
  association,
  modelById,
  dbOptions,
}: GetForeignKeyArgs): string {
  if (association.foreignKey) return caseByDbCaseStyle(association.foreignKey, dbOptions.caseStyle)

  const name =
    association.alias && association.type.type === AssociationTypeType.BelongsTo
      ? association.alias
      : association.type.type === AssociationTypeType.BelongsTo
      ? modelById[association.targetModelId].name
      : model.name

  return caseByDbCaseStyle(`${name} id`, dbOptions.caseStyle)
}

type GetOtherKeyArgs = {
  association: Association
  modelById: ModelById
  dbOptions: DbOptions
}
export function getOtherKey({ association, modelById, dbOptions }: GetOtherKeyArgs): string | null {
  if (association.type.type !== AssociationTypeType.ManyToMany) return null
  if (association.type.targetFk) return association.type.targetFk

  const name = association.alias ? association.alias : modelById[association.targetModelId].name

  return caseByDbCaseStyle(`${name} id`, dbOptions.caseStyle)
}
