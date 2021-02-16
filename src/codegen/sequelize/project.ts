import { DatabaseOptions } from '../../database'
import { directory, DirectoryItem, file } from '../../files'
import { kebabCase, pascalCase } from '../../helpers/string'
import { Schema } from '../../schema'
import { dbTemplate } from './templates/db'
import { gitignoreTemplate } from './templates/gitignore'
import { initModelsTemplate } from './templates/initModels'
import { modelTemplate } from './templates/model'
import { packageJsonTemplate } from './templates/packageJson'
import { serverTemplate } from './templates/server'
import { tsconfigTemplate } from './templates/tsconfig'
import { typesTemplate } from './templates/types'
import { hasJsonType } from './utils'

export { generateSequelizeProject }

type GenerateSequelizeProjectArgs = {
  schema: Schema
  options: DatabaseOptions
}

const generateSequelizeProject = ({
  schema,
  options,
}: GenerateSequelizeProjectArgs): DirectoryItem =>
  directory(kebabCase(schema.name), [
    directory('models', [
      file('index.ts', initModelsTemplate({ schema, options })),
      ...schema.models.map((model) =>
        file(`${pascalCase(model.name)}.ts`, modelTemplate({ schema, options, model })),
      ),
    ]),
    file('.gitignore', gitignoreTemplate()),
    file('db.ts', dbTemplate({ schema, options })),
    file('package.json', packageJsonTemplate({ schema, options })),
    file('server.ts', serverTemplate()),
    schema.models.some(hasJsonType) ? file('types.ts', typesTemplate()) : null,
    file('tsconfig.json', tsconfigTemplate()),
  ])
