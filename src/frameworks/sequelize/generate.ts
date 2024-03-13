import { SchemaMeta } from '@src/api/meta'
import { blank, lines } from '@src/core/codegen'
import { DbOptions, caseByDbCaseStyle } from '@src/core/database'
import { DirectoryItem, directory, file, itemName } from '@src/core/files/fileSystem'
import {
  Association,
  AssociationTypeType,
  Field,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
  belongsToType,
  association as buildAssociation,
  field as buildField,
  model as buildModel,
  isThroughTable,
  resetType,
} from '@src/core/schema'
import { arrayToLookup, dedupBy } from '@src/utils/array'
import { addSeconds, now, toNumericTimestamp } from '@src/utils/dateTime'
import {
  kebabCase,
  namesEq,
  namesEqSingular,
  noCase,
  normalize,
  normalizeSingular,
  uniqueId,
} from '@src/utils/string'
import { config } from './templates/config'
import { dbTemplate } from './templates/db'
import { gitignoreTemplate } from './templates/gitignore'
import { initModelsTemplate } from './templates/initModels'
import { createModelMigration, migrationCreateFilename } from './templates/migrations/createModel'
import { modelTemplate } from './templates/model'
import { packageJsonTemplate } from './templates/packageJson'
import { readmeTemplate } from './templates/readme'
import { serverTemplate } from './templates/server'
import { tsconfigTemplate } from './templates/tsconfig'
import { typesTemplate } from './templates/types'
import { getForeignKey, getOtherKey } from './utils/associations'
import { hasJsonType } from './utils/dataTypes'
import { getTimestampFields, idField, prefixPk } from './utils/field'
import { dbTableName } from './utils/migrations'
import { modelFileName } from './utils/model'

type GenerateSequelizeProjectArgs = {
  schema: Schema
  meta?: SchemaMeta
  dbOptions: DbOptions
}

export function generateSequelizeProject({
  schema: nonNormalizedSchema,
  meta,
  dbOptions,
}: GenerateSequelizeProjectArgs): DirectoryItem {
  const schema = normalizeSchema({ schema: nonNormalizedSchema, dbOptions })
  const migrationModels = getMigrationModels({ schema, dbOptions })
  const migrationTimestamps = migrationModels.reduce(migrationTimestamp, new Map())
  const hasAssocs = schema.models.some((m) => m.associations.length > 0)

  return directory(kebabCase(schema.name), [
    directory('config', [file('config.js', config({ schema, dbOptions }))]),
    dbOptions?.migrations && schema.models.length > 0
      ? directory(
          'migrations',
          Array.from(migrationTimestamps)
            .sort((a, b) => a[0] - b[0])
            .map(([timestamp, model]) =>
              file(
                migrationCreateFilename({ model, dbOptions, timestamp }),
                createModelMigration({ model, dbOptions }),
              ),
            )
            .concat(
              hasAssocs
                ? file(
                    migrationForeignKeysFilename(nextTimestamp(migrationTimestamps)),
                    addForeignKeysMigration({ models: migrationModels, dbOptions }),
                  )
                : [],
            ),
        )
      : null,
    directory(
      'models',
      [
        file('index.ts', initModelsTemplate({ schema, dbOptions })),
        ...schema.models.map((model) =>
          file(modelFileName(model), modelTemplate({ schema, dbOptions, model })),
        ),
      ].sort((a, b) => itemName(a).localeCompare(itemName(b))),
    ),
    file('.gitignore', gitignoreTemplate()),
    file('db.ts', dbTemplate({ dbOptions })),
    file('package.json', packageJsonTemplate({ schema, dbOptions })),
    file('README.md', readmeTemplate({ schema, meta, dbOptions })),
    file('server.ts', serverTemplate({ dbOptions })),
    schema.models.some(hasJsonType) ? file('types.ts', typesTemplate()) : null,
    file('tsconfig.json', tsconfigTemplate()),
  ])
}

type GetMigrationModelsArgs = {
  schema: Schema
  dbOptions: DbOptions
}
function getMigrationModels({ schema, dbOptions }: GetMigrationModelsArgs): MigrationModel[] {
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
function addDbColumnFields({ model, schema, dbOptions }: AddDbColumnFields): MigrationModel {
  const withTimestamps = addTimestampFields({ model, dbOptions })
  return addReferences({ model: withTimestamps, schema, dbOptions })
}

type AddTimestampFieldsArgs = {
  model: Model
  dbOptions: DbOptions
}
function addTimestampFields({ model, dbOptions }: AddTimestampFieldsArgs): Model {
  const fields = model.fields.concat(getTimestampFields({ model, dbOptions }))
  return { ...model, fields: dedupBy(fields, (f) => normalizeSingular(f.name)) }
}

type AddReferencesArgs = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}
function addReferences({ model, schema, dbOptions }: AddReferencesArgs): MigrationModel {
  const fkFields = getFkFields({ model, schema, dbOptions })

  const fields = dedupBy(
    model.fields
      .map<MigrationField>((field) => {
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
function getFkFields({ model, schema, dbOptions }: GetFkFieldsArgs): MigrationField[] {
  const modelById = arrayToLookup<Model>(schema.models, (m) => m.id)
  const sourceFields = model.associations
    .filter((a) => a.type.type === AssociationTypeType.BelongsTo)
    .map<MigrationField | null>((association) => {
      const fk = getForeignKey({ model, association, modelById, dbOptions })
      const target = modelById.get(association.targetModelId)
      return target
        ? getMigrationField({ model: target, fk, dbOptions })
        : /* istanbul ignore next */
          null
    })
    .filter((fr): fr is MigrationField => !!fr)

  const targetFields = schema.models
    .flatMap((m) => m.associations)
    .filter(
      (a) =>
        (a.type.type === AssociationTypeType.HasOne ||
          a.type.type === AssociationTypeType.HasMany) &&
        a.targetModelId === model.id,
    )
    .map<MigrationField | null>((association) => {
      const source = modelById.get(association.sourceModelId)
      const fk = source && getForeignKey({ model: source, association, modelById, dbOptions })
      return source && fk
        ? getMigrationField({ model: source, fk, dbOptions })
        : /* istanbul ignore next */
          null
    })
    .filter((fr): fr is MigrationField => !!fr)

  const hasPk = model.fields.some((f) => f.primaryKey)
  const joinFields = schema.models
    .flatMap((m) => m.associations)
    .filter(
      (a): a is Association<ManyToManyAssociation> =>
        a.type.type === AssociationTypeType.ManyToMany &&
        a.type.through.type === ThroughType.ThroughModel &&
        a.type.through.modelId === model.id,
    )
    .flatMap<MigrationField | null>((association) => {
      const primaryKey = hasPk ? undefined : /* istanbul ignore next */ true

      const source = modelById.get(association.sourceModelId)
      const sourceFk = source && getForeignKey({ model: source, association, modelById, dbOptions })

      const sourceField =
        source &&
        sourceFk &&
        getMigrationField({
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
        getMigrationField({
          model: target,
          fk: targetFk,
          dbOptions,
          primaryKey,
        })

      return [sourceField, targetField].filter((f): f is MigrationField => !!f)
    })
    .filter((fr): fr is MigrationField => !!fr)

  return dedupBy<MigrationField>(
    sourceFields.concat(targetFields).concat(joinFields),
    (field) => field.name,
  )
}

type GetMigrationFieldArgs = {
  model: Model
  fk: string
  dbOptions: DbOptions
  primaryKey?: boolean
}
function getMigrationField({
  model,
  fk,
  dbOptions,
  primaryKey = false,
}: GetMigrationFieldArgs): MigrationField {
  const pk =
    model.fields.find((field) => field.primaryKey) ||
    /* istanbul ignore next */
    idField({ model: model, dbOptions })
  const table = dbTableName({ model: model, dbOptions })
  const columnField = prefixPk({ field: pk, model: model, dbOptions })
  const column = caseByDbCaseStyle(columnField.name, dbOptions.caseStyle)

  const field: Field = buildField({
    name: fk,
    type: resetType(pk.type),
    primaryKey,
  })

  return { ...field, reference: { table, column } }
}

function getJoinTables(schema: Schema, dbOptions: DbOptions): Model[] {
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
  const { type } = association
  if (type.type != AssociationTypeType.ManyToMany || !isThroughTable(type.through)) return null

  const source = modelById.get(association.sourceModelId)
  const target = modelById.get(association.targetModelId)

  /* istanbul ignore next */
  if (!source || !target) return null

  const sourceFk = getForeignKey({ model: source, association, modelById, dbOptions })

  /* istanbul ignore next */
  if (!sourceFk) return null

  const sourceFkField = getMigrationField({
    model: source,
    fk: sourceFk,
    dbOptions,
    primaryKey: true,
  })

  const id = uniqueId()

  const sourceAssoc: Association = buildAssociation({
    sourceModelId: id,
    targetModelId: source.id,
    type: belongsToType(),
  })

  const targetFk = getOtherKey({ association, modelById, dbOptions })

  if (!targetFk) return null

  const targetFkField = getMigrationField({
    model: target,
    fk: targetFk,
    dbOptions,
    primaryKey: true,
  })

  const targetAssoc: Association = buildAssociation({
    sourceModelId: id,
    targetModelId: target.id,
    type: belongsToType(),
  })

  return buildModel({
    id,
    name: type.through.table,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    fields: [sourceFkField, targetFkField],
    associations: [sourceAssoc, targetAssoc],
  })
}

type MigrationTimestamps = Map<number, Model>
function migrationTimestamp(timestamps: MigrationTimestamps, model: Model): MigrationTimestamps {
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

function nextTimestamp(timestamps: MigrationTimestamps): number {
  const currMax = Math.max(0, ...timestamps.keys())
  /* istanbul ignore next */
  return currMax ? currMax + 10 : toNumericTimestamp(now())
}

function dedupModels(models: Model[]): Model[] {
  const visitedModels: Record<string, Model> = {}
  const names: string[] = []
  models.forEach((model) => {
    const name = noCase(model.name)
    const visitedModel = visitedModels[name]
    if (visitedModel) {
      visitedModels[name] = mergeFields(visitedModel, model)
    } else {
      visitedModels[name] = model
      names.push(name)
    }
  })

  return names.map((name) => visitedModels[name])
}

function mergeFields(x: Model, y: Model): Model {
  const xHasPk = x.fields.some((f) => f.primaryKey)

  const [, yDiffs] = y.fields.reduce(
    (acc, y_) => {
      const yWithoutPk = { ...y_, primaryKey: false }
      const y = xHasPk ? yWithoutPk : y_
      if (x.fields.some((x) => namesEqSingular(x.name, y.name))) {
        acc[0].push(y)
      } else {
        acc[1].push(y)
      }
      return acc
    },
    [[], []] as [Field[], Field[]],
  )

  const fields = dedupBy([...x.fields, ...yDiffs], (f) => normalize(f.name))
  return { ...x, fields }
}

type NormalizeSchemaArgs = {
  schema: Schema
  dbOptions: DbOptions
}
const normalizeSchema = ({ schema, dbOptions }: NormalizeSchemaArgs): Schema => {
  return { ...schema, models: schema.models.map((model) => normalizeModel({ model, dbOptions })) }
}

type NormalizeModelArgs = {
  model: Model
  dbOptions: DbOptions
}
const normalizeModel = ({ model, dbOptions }: NormalizeModelArgs): Model => {
  return { ...model, fields: getFieldsWithPk({ model, dbOptions }) }
}

type GetFieldsWithIdArgs = {
  model: Model
  dbOptions: DbOptions
}
function getFieldsWithPk({ model, dbOptions }: GetFieldsWithIdArgs): Field[] {
  const pks = model.fields.filter((f) => f.primaryKey)

  // Don't apply any prefixes if pk is composite
  if (pks.length > 1) return model.fields
  // Add explicit pk field for TypeScript classes
  if (pks.length === 0) return [idField({ model, dbOptions }), ...model.fields]
  // Prefix pk with model name if pk is standard  format and prefixPk option is true
  return model.fields.map((field) => prefixPk({ field, model, dbOptions }))
}

function migrationForeignKeysFilename(timestamp: number): string {
  return `${timestamp}-add-foreign-keys.js`
}

type Constraint = {
  sourceTable: string
  sourceColumn: string
  targetTable: string
  targetColumn: string
  name: string
}

type AddForeignKeysMigrationArgs = {
  models: MigrationModel[]
  dbOptions: DbOptions
}
function addForeignKeysMigration({ dbOptions, models }: AddForeignKeysMigrationArgs): string {
  const constraints: Constraint[] = models.flatMap((model) =>
    getModelConstraints({ model, dbOptions }),
  )

  return lines([
    // TODO refactor type defs to use either Sequelize or DataTypes
    `const DataTypes = require('sequelize').DataTypes`,
    blank(),
    `module.exports = {`,
    up({ constraints }),
    down({ constraints }),
    `};`,
  ])
}

type UpArgs = {
  constraints: Constraint[]
}
function up({ constraints }: UpArgs): string {
  return lines(
    [
      `up: async (queryInterface, Sequelize) => {`,
      lines(
        constraints.map((constraint) => {
          return lines([
            `await queryInterface.addConstraint('${constraint.sourceTable}', {`,
            lines(constraintFields(constraint), {
              depth: 2,
            }),
            `})`,
          ])
        }),
        { depth: 2, separator: '\n' },
      ),
      '},',
    ],
    { depth: 2 },
  )
}

type DownArgs = {
  constraints: Constraint[]
}
function down({ constraints }: DownArgs): string {
  return lines(
    [
      `down: async (queryInterface, Sequelize) => {`,
      lines(
        constraints.map(({ sourceTable, name }) => {
          return lines([`await queryInterface.removeConstraint('${sourceTable}', '${name}')`], {
            depth: 2,
            separator: '\n',
          })
        }),
      ),
      '}',
    ],
    { depth: 2 },
  )
}

type MigrationModel = Omit<Model, 'fields'> & { fields: MigrationField[]; noPrimaryKey?: boolean }
type MigrationField = Field & { reference?: Reference }

type Reference = {
  table: string
  column: string
}

type GetModelConstraintsArgs = {
  model: MigrationModel
  dbOptions: DbOptions
}
function getModelConstraints({ model, dbOptions }: GetModelConstraintsArgs): Constraint[] {
  const sourceTable = dbTableName({ model, dbOptions })

  return model.fields
    .map<Constraint | null>((field) => {
      if (!field.reference) return null
      const sourceColumn = caseByDbCaseStyle(field.name, dbOptions.caseStyle)
      return {
        sourceTable,
        sourceColumn,
        targetTable: field.reference.table,
        targetColumn: field.reference.column,
        name: `${sourceTable}_${sourceColumn}_fkey`,
      }
    })
    .filter((c): c is Constraint => !!c)
}

function constraintFields({
  sourceColumn,
  targetTable,
  targetColumn,
  name,
}: Constraint): (string | null)[] {
  return [
    `fields: ['${sourceColumn}'],`,
    `type: 'foreign key',`,
    // TODO: name by sql dialect conventions
    `name: '${name}',`,
    'references: {',
    lines([`table: '${targetTable}'`, `field: '${targetColumn}'`], {
      depth: 2,
      separator: ',',
    }),
    '}',
  ]
}
