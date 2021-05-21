import { DbOptions } from '@src/core/database'
import { directory, DirectoryItem, file } from '@src/core/files'
import { Model, Schema } from '@src/core/schema'
import { kebabCase } from '@src/utils/string'
import {
  getFieldsWithPk,
  hasJsonType,
  migrationCreateFilename,
  migrationForeignKeysFilename,
  modelName,
} from './helpers'
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

type GenerateSequelizeProjectArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export function generateSequelizeProject({
  schema: nonNormalizedSchema,
  dbOptions,
}: GenerateSequelizeProjectArgs): DirectoryItem {
  const schema = normalizeSchema({ schema: nonNormalizedSchema, dbOptions })

  return directory(kebabCase(schema.name), [
    directory('config', [file('config.js', config({ schema, dbOptions }))]),
    dbOptions?.migrations
      ? directory(
          'migrations',
          schema.models
            .map((model, index) =>
              file(
                migrationCreateFilename({ model, dbOptions, index }),
                createModelMigration({ model, schema, dbOptions }),
              ),
            )
            .concat(
              // TODO, check that has foreign keys
              file(
                migrationForeignKeysFilename(schema.models.length),
                addForeignKeysMigration({ schema, dbOptions }),
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
