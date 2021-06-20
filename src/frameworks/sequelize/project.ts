import { DbOptions } from '@src/core/database'
import { directory, DirectoryItem, file } from '@src/core/files'
import { Schema } from '@src/core/schema'
import { kebabCase } from '@src/utils/string'
import { config } from './templates/config'
import { dbTemplate } from './templates/db'
import { gitignoreTemplate } from './templates/gitignore'
import { initModelsTemplate } from './templates/initModels'
import {
  addForeignKeysMigration,
  migrationForeignKeysFilename,
} from './templates/migrations/addForeignKeys'
import { createModelMigration, migrationCreateFilename } from './templates/migrations/createModel'
import { modelTemplate } from './templates/model'
import { packageJsonTemplate } from './templates/packageJson'
import { serverTemplate } from './templates/server'
import { tsconfigTemplate } from './templates/tsconfig'
import { typesTemplate } from './templates/types'
import { hasJsonType } from './utils/dataTypes'
import { getJoinTables, migrationTimestamp, nextTimestamp } from './utils/migrations'
import { dedupModels, modelName } from './utils/model'
import { normalizeSchema } from './utils/schema'

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
