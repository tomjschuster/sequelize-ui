import { SchemaMeta } from '@src/api/meta'
import { DbOptions } from '@src/core/database'
import { directory, DirectoryItem, file, itemName } from '@src/core/files/fileSystem'
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
import { readmeTemplate } from './templates/readme'
import { serverTemplate } from './templates/server'
import { tsconfigTemplate } from './templates/tsconfig'
import { typesTemplate } from './templates/types'
import { hasJsonType } from './utils/dataTypes'
import { getMigrationModels, migrationTimestamp, nextTimestamp } from './utils/migrations'
import { modelFileName } from './utils/model'
import { normalizeSchema } from './utils/schema'

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
