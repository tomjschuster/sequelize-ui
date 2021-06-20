import { DbOptions } from '@src/core/database'
import { directory, DirectoryItem, file } from '@src/core/files'
import {
  Association,
  AssociationTypeType,
  belongsToType,
  Field,
  Model,
  Schema,
  ThroughType,
  typeWithoutOptions,
} from '@src/core/schema'
import { arrayToLookup, dedupBy } from '@src/utils/array'
import { addSeconds, now, toNumericTimestamp } from '@src/utils/dateTime'
import { kebabCase, namesEqSingular, noCase, normalize } from '@src/utils/string'
import shortid from 'shortid'
import { config } from './templates/config'
import { dbTemplate } from './templates/db'
import { gitignoreTemplate } from './templates/gitignore'
import { initModelsTemplate } from './templates/initModels'
import { addForeignKeysMigration } from './templates/migrations/addForeignKeys'
import { createModelMigration } from './templates/migrations/createModel'
import { modelTemplate } from './templates/model'
import { packageJsonTemplate } from './templates/packageJson'
import { serverTemplate } from './templates/server'
import { tsconfigTemplate } from './templates/tsconfig'
import { typesTemplate } from './templates/types'
import {
  getFieldsWithPk,
  getForeignKey,
  getOtherKey,
  hasJsonType,
  idField,
  migrationCreateFilename,
  migrationForeignKeysFilename,
  modelName,
} from './utils/helpers'

type GenerateSequelizeProjectArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export function generateSequelizeProject({
  schema: nonNormalizedSchema,
  dbOptions,
}: GenerateSequelizeProjectArgs): DirectoryItem {
  const schema = normalizeSchema({ schema: nonNormalizedSchema, dbOptions })
  const joinTables = getJoinTables(schema, dbOptions)
  const migrationModels = dedupModels([...schema.models, ...joinTables])
  const schemaWithMigrations = { ...schema, models: migrationModels }
  const migrationTimestamps = migrationModels.reduce(migrationTimestamp, new Map())

  return directory(kebabCase(schema.name), [
    directory('config', [file('config.js', config({ schema, dbOptions }))]),
    dbOptions?.migrations
      ? directory(
          'migrations',
          Array.from(migrationTimestamps)
            .sort((a, b) => a[0] - b[0])
            .map(([timestamp, model]) =>
              file(
                migrationCreateFilename({ model, dbOptions, timestamp }),
                createModelMigration({ model, schema, dbOptions }),
              ),
            )
            .concat(
              // TODO, check that has foreign keys
              file(
                migrationForeignKeysFilename(nextTimestamp(migrationTimestamps)),
                addForeignKeysMigration({ schema: schemaWithMigrations, dbOptions }),
              ),
            ),
        )
      : null,
    directory('models', [
      file('index.ts', initModelsTemplate({ schema, dbOptions })),
      ...schema.models.map((model) =>
        file(`${modelName(model)}.ts`, modelTemplate({ schema, dbOptions, model })),
      ),
    ]),
    file('.gitignore', gitignoreTemplate()),
    file('db.ts', dbTemplate({ dbOptions })),
    file('package.json', packageJsonTemplate({ schema, dbOptions })),
    file('server.ts', serverTemplate({ dbOptions })),
    schema.models.some(hasJsonType) ? file('types.ts', typesTemplate()) : null,
    file('tsconfig.json', tsconfigTemplate()),
  ])
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
      const { primaryKey: _, ...yWithoutPk } = y_
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
  return currMax ? currMax + 10 : toNumericTimestamp(now())
}
