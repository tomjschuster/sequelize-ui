import { caseByDbCaseStyle, DbOptions } from '@src/core/database'
import {
  Association,
  AssociationTypeType,
  belongsToType,
  dateTimeDataType,
  Field,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
  typeWithoutOptions,
} from '@src/core/schema'
import { arrayToLookup, dedupBy } from '@src/utils/array'
import { addSeconds, now, toNumericTimestamp } from '@src/utils/dateTime'
import { namesEq } from '@src/utils/string'
import shortid from 'shortid'
import { getForeignKey, getOtherKey } from './associations'
import { idField, prefixPk } from './field'
import { dbTableName } from './helpers'

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
  const timestampFields = getTimestampFields({ dbOptions }).filter(
    (field) => !model.fields.some((f) => namesEq(field.name, f.name)),
  )
  const fields = model.fields.concat(timestampFields)
  const modelWithFields: Model = { ...model, fields }
  const fkFields = getFkFields({ model: modelWithFields, schema, dbOptions })

  return fields
    .map<[Field, Reference | null]>((field) => {
      const fr = fkFields.find(([f]) => namesEq(field.name, f.name))
      return [field, fr?.[1] || null]
    })
    .concat(fkFields.filter(([field]) => !fields.some((f) => namesEq(field.name, f.name))))
}

type GetTimestampFieldsTemplateArgs = {
  dbOptions: DbOptions
}
function getTimestampFields({ dbOptions }: GetTimestampFieldsTemplateArgs): Field[] {
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

      const target = modelById.get(association.targetModelId)

      if (!target) {
        console.error(
          `Target model ${association.targetModelId} not found from model ${model.name}`,
        )
        return null
      }

      const targetPk =
        target.fields.find((field) => field.primaryKey) || idField({ model: target, dbOptions })
      const table = dbTableName({ model: target, dbOptions })
      const columnField = prefixPk({ field: targetPk, model: target, dbOptions })
      const column = caseByDbCaseStyle(columnField.name, dbOptions.caseStyle)
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
      const source = modelById.get(association.sourceModelId)
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
      const columnField = prefixPk({ field: sourcePk, model: source, dbOptions })
      const column = caseByDbCaseStyle(columnField.name, dbOptions.caseStyle)
      const field = { id: shortid(), name: fk, type: typeWithoutOptions(sourcePk.type) }

      return [field, { table, column }]
    })
    .filter((fr): fr is [Field, Reference] => !!fr)

  const hasPk = model.fields.some((f) => f.primaryKey)
  const joinFields = schema.models
    .flatMap((m) => m.associations)
    .filter(
      (a): a is Association<ManyToManyAssociation> =>
        a.type.type === AssociationTypeType.ManyToMany &&
        a.type.through.type === ThroughType.ThroughModel &&
        a.type.through.modelId === model.id,
    )
    .flatMap<[Field, Reference] | null>((association) => {
      const source = modelById.get(association.sourceModelId)
      const target = modelById.get(association.targetModelId)
      if (!source) {
        console.error(
          `Target model ${association.sourceModelId} not found from model ${model.name}`,
        )
        return null
      }

      if (!target) {
        console.error(
          `Target model ${association.targetModelId} not found from model ${model.name}`,
        )
        return null
      }
      const sourceFk = getForeignKey({ model: source, association, modelById, dbOptions })

      const sourcePk =
        source.fields.find((field) => field.primaryKey) || idField({ model: source, dbOptions })
      const sourceTable = dbTableName({ model: source, dbOptions })
      const sourceColumnField = prefixPk({ field: sourcePk, model: target, dbOptions })
      const sourceColumn = caseByDbCaseStyle(sourceColumnField.name, dbOptions.caseStyle)

      const sourceField = {
        id: shortid(),
        name: sourceFk,
        type: typeWithoutOptions(sourcePk.type),
        primaryKey: hasPk ? undefined : true,
      }

      const targetFk = getOtherKey({ association, modelById, dbOptions })
      const targetPk =
        target.fields.find((field) => field.primaryKey) || idField({ model: target, dbOptions })

      const targetTable = dbTableName({ model: target, dbOptions })
      const targetColumnField = prefixPk({ field: targetPk, model: target, dbOptions })
      const targetColumn = caseByDbCaseStyle(targetColumnField.name, dbOptions.caseStyle)
      const targetField = {
        id: shortid(),
        name: targetFk,
        type: typeWithoutOptions(targetPk.type),
        primaryKey: hasPk ? undefined : true,
      }

      return [
        [sourceField, { table: sourceTable, column: sourceColumn }],
        [targetField, { table: targetTable, column: targetColumn }],
      ] as ReadonlyArray<[Field, Reference]>
    })
    .filter((fr): fr is [Field, Reference] => !!fr)

  return dedupBy<[Field, Reference]>(
    sourceFields.concat(targetFields).concat(joinFields),
    ([field]) => field.name,
  )
}

export function getJoinTables(schema: Schema, dbOptions: DbOptions): Model[] {
  const modelById = arrayToLookup(schema.models, (m) => m.id)
  return schema.models
    .flatMap((m) => m.associations.map((a) => getJoinTableModel(a, modelById, dbOptions)))
    .filter((m): m is Model => !!m)
}

function getJoinTableModel(
  association: Association,
  modelById: Map<string, Model>,
  dbOptions: DbOptions,
): Model | null {
  if (association.type.type !== AssociationTypeType.ManyToMany) return null

  const id = shortid()

  const tableName =
    association.type.through.type === ThroughType.ThroughTable
      ? association.type.through.table
      : null

  if (!tableName) return null

  const source = modelById.get(association.sourceModelId)
  const target = modelById.get(association.targetModelId)

  if (!source || !target) return null

  const sourceFk = getOtherKey({ association, modelById, dbOptions })

  if (!sourceFk) return null

  const sourcePk =
    source.fields.find((field) => field.primaryKey) || idField({ model: source, dbOptions })

  const sourceFkField = {
    id: shortid(),
    name: sourceFk,
    type: typeWithoutOptions(sourcePk.type),
    primaryKey: true,
  }

  const sourceAssoc: Association = {
    id: shortid(),
    sourceModelId: id,
    targetModelId: source.id,
    type: belongsToType(),
  }

  const targetFk = getForeignKey({ model: target, association, modelById, dbOptions })

  const targetPk =
    target.fields.find((field) => field.primaryKey) || idField({ model: target, dbOptions })

  const targetFkField = {
    id: shortid(),
    name: targetFk,
    type: typeWithoutOptions(targetPk.type),
    primaryKey: true,
  }

  const targetAssoc: Association = {
    id: shortid(),
    sourceModelId: id,
    targetModelId: target.id,
    type: belongsToType(),
  }

  return {
    id,
    name: tableName,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    fields: [sourceFkField, targetFkField],
    associations: [sourceAssoc, targetAssoc],
  }
}

type MigrationTimestamps = Map<number, Model>
export function migrationTimestamp(
  timestamps: MigrationTimestamps,
  model: Model,
): MigrationTimestamps {
  const timestamp = toNumericTimestamp(model.createdAt)
  if (timestamps.get(timestamp)) return migrationTimestamp(timestamps, add10(model))
  return timestamps.set(timestamp, model)
}

function add10(model: Model): Model {
  return {
    ...model,
    createdAt: addSeconds(model.createdAt, 10),
    updatedAt: addSeconds(model.updatedAt, 10),
  }
}

export function nextTimestamp(timestamps: MigrationTimestamps): number {
  const currMax = Math.max(0, ...timestamps.keys())
  return currMax ? currMax + 10 : toNumericTimestamp(now())
}
