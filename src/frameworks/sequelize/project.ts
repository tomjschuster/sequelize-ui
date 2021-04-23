import { DatabaseOptions } from '@src/core/database'
import { directory, DirectoryItem, file } from '@src/core/files'
import { Schema } from '@src/core/schema'
import { kebabCase } from '@src/core/utils/string'
import { hasJsonType, modelName } from './helpers'
import { dbTemplate } from './templates/db'
import { gitignoreTemplate } from './templates/gitignore'
import { initModelsTemplate } from './templates/initModels'
import { modelTemplate } from './templates/model'
import { packageJsonTemplate } from './templates/packageJson'
import { serverTemplate } from './templates/server'
import { tsconfigTemplate } from './templates/tsconfig'
import { typesTemplate } from './templates/types'

type GenerateSequelizeProjectArgs = {
  schema: Schema
  dbOptions: DatabaseOptions
}

export const generateSequelizeProject = ({
  schema,
  dbOptions,
}: GenerateSequelizeProjectArgs): DirectoryItem =>
  directory(kebabCase(schema.name), [
    directory('models', [
      file('index.ts', initModelsTemplate({ schema, dbOptions })),
      ...schema.models.map((model) =>
        file(`${modelName(model)}.ts`, modelTemplate({ schema, dbOptions, model })),
      ),
    ]),
    file('.gitignore', gitignoreTemplate()),
    file('db.ts', dbTemplate({ schema, dbOptions })),
    file('package.json', packageJsonTemplate({ schema, dbOptions })),
    file('server.ts', serverTemplate()),
    schema.models.some(hasJsonType) ? file('types.ts', typesTemplate()) : null,
    file('tsconfig.json', tsconfigTemplate()),
  ])
