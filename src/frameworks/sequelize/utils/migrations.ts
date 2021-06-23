import {
  caseByDbCaseStyle,
  DbOptions,
  nounFormByDbNounForm,
  tableCaseByDbCaseStyle,
} from '@src/core/database'
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
import { namesEq, normalize, normalizeSingular } from '@src/utils/string'
import shortid from 'shortid'
import { getForeignKey, getOtherKey } from './associations'
import { idField, prefixPk } from './field'
import { dedupModels } from './model'

export type ModelWithReferences = Omit<Model, 'fields'> & { fields: FieldWithReference[] }
export type FieldWithReference = Field & { reference?: Reference }

export type Reference = {
  table: string
  column: string
}

type DbTableNameArgs = {
  model: Model
  dbOptions: DbOptions
}
export function dbTableName({ model, dbOptions }: DbTableNameArgs): string {
  const casedName = tableCaseByDbCaseStyle(model.name, dbOptions.caseStyle)
  return nounFormByDbNounForm(casedName, dbOptions.nounForm)
}

type GetMigrationModelsArgs = {
  schema: Schema
  dbOptions: DbOptions
}
export function getMigrationModels({
  schema,
  dbOptions,
}: GetMigrationModelsArgs): ModelWithReferences[] {
  const joinTables = getJoinTables(schema, dbOptions)
  const modelsWithReferences = schema.models.map((model) =>
    addDbColumnFields({ model, schema, dbOptions }),
  )
  return dedupModels([...modelsWithReferences, ...joinTables])
}

type AddDbColumnFields = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}
function addDbColumnFields({ model, schema, dbOptions }: AddDbColumnFields): ModelWithReferences {
  const withTimestamps = addTimestampFields({ model, dbOptions })
  return addReferences({ model: withTimestamps, schema, dbOptions })
}

type AddTimestampFieldsArgs = {
  model: Model
  dbOptions: DbOptions
}
function addTimestampFields({ model, dbOptions }: AddTimestampFieldsArgs): Model {
  const fields = model.fields.concat(getTimestampFields({ dbOptions }))
  return { ...model, fields: dedupBy(fields, (f) => normalizeSingular(f.name)) }
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

type AddReferencesArgs = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}
function addReferences({ model, schema, dbOptions }: AddReferencesArgs): ModelWithReferences {
  const fkFields = getFkFields({ model, schema, dbOptions })

  const fields = dedupBy(
    model.fields
      .map<FieldWithReference>((field) => {
        const fr = fkFields.find((f) => namesEq(field.name, f.name))
        return { ...field, reference: fr?.reference }
      })
      .concat(fkFields),
    (f) => normalize(f.name),
  )

  return { ...model, fields }
}

type GetFkFieldsArgs = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}
function getFkFields({ model, schema, dbOptions }: GetFkFieldsArgs): FieldWithReference[] {
  const modelById = arrayToLookup<Model>(schema.models, (m) => m.id)
  const sourceFields = model.associations
    .filter((a) => a.type.type === AssociationTypeType.BelongsTo)
    .map<FieldWithReference | null>((association) => {
      const fk = getForeignKey({ model, association, modelById, dbOptions })
      const target = modelById.get(association.targetModelId)
      return target
        ? getFieldWithReference({ model: target, fk, dbOptions })
        : /* istanbul ignore next */
          null
    })
    .filter((fr): fr is FieldWithReference => !!fr)

  const targetFields = schema.models
    .flatMap((m) => m.associations)
    .filter(
      (a) =>
        (a.type.type === AssociationTypeType.HasOne ||
          a.type.type === AssociationTypeType.HasMany) &&
        a.targetModelId === model.id,
    )
    .map<FieldWithReference | null>((association) => {
      const source = modelById.get(association.sourceModelId)
      const fk = source && getForeignKey({ model: source, association, modelById, dbOptions })
      return source && fk
        ? getFieldWithReference({ model: source, fk, dbOptions })
        : /* istanbul ignore next */
          null
    })
    .filter((fr): fr is FieldWithReference => !!fr)

  const hasPk = model.fields.some((f) => f.primaryKey)
  const joinFields = schema.models
    .flatMap((m) => m.associations)
    .filter(
      (a): a is Association<ManyToManyAssociation> =>
        a.type.type === AssociationTypeType.ManyToMany &&
        a.type.through.type === ThroughType.ThroughModel &&
        a.type.through.modelId === model.id,
    )
    .flatMap<FieldWithReference | null>((association) => {
      const primaryKey = hasPk ? undefined : /* istanbul ignore next */ true

      const source = modelById.get(association.sourceModelId)
      const sourceFk = source && getForeignKey({ model: source, association, modelById, dbOptions })

      const sourceField =
        source &&
        sourceFk &&
        getFieldWithReference({
          model: source,
          fk: sourceFk,
          dbOptions,
          primaryKey,
        })

      const target = modelById.get(association.targetModelId)
      const targetFk = getOtherKey({ association, modelById, dbOptions })

      const targetField =
        target &&
        targetFk &&
        getFieldWithReference({
          model: target,
          fk: targetFk,
          dbOptions,
          primaryKey,
        })

      return [sourceField, targetField].filter((f): f is FieldWithReference => !!f)
    })
    .filter((fr): fr is FieldWithReference => !!fr)

  return dedupBy<FieldWithReference>(
    sourceFields.concat(targetFields).concat(joinFields),
    (field) => field.name,
  )
}

type GetFieldWithReferenceArgs = {
  model: Model
  fk: string
  dbOptions: DbOptions
  primaryKey?: boolean
}
function getFieldWithReference({
  model,
  fk,
  dbOptions,
  primaryKey,
}: GetFieldWithReferenceArgs): FieldWithReference {
  const pk =
    model.fields.find((field) => field.primaryKey) ||
    /* istanbul ignore next */
    idField({ model: model, dbOptions })
  const table = dbTableName({ model: model, dbOptions })
  const columnField = prefixPk({ field: pk, model: model, dbOptions })
  const column = caseByDbCaseStyle(columnField.name, dbOptions.caseStyle)
  const field = { id: shortid(), name: fk, type: typeWithoutOptions(pk.type), primaryKey }

  return { ...field, reference: { table, column } }
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

  /* istanbul ignore next */
  if (!source || !target) return null

  const sourceFk = getOtherKey({ association, modelById, dbOptions })

  /* istanbul ignore next */
  if (!sourceFk) return null

  const sourceFkField = getFieldWithReference({
    model: source,
    fk: sourceFk,
    dbOptions,
    primaryKey: true,
  })

  const sourceAssoc: Association = {
    id: shortid(),
    sourceModelId: id,
    targetModelId: source.id,
    type: belongsToType(),
  }

  const targetFk = getForeignKey({ model: target, association, modelById, dbOptions })

  const targetFkField = getFieldWithReference({ model: target, fk: targetFk, dbOptions })

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
  /* istanbul ignore next */
  return currMax ? currMax + 10 : toNumericTimestamp(now())
}
