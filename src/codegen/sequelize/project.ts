import { DatabaseOptions } from '../../database'
import { directory, DirectoryItem, file } from '../../files'
import { kebabCase, pascalCase } from '../../helpers/string'
import { Schema } from '../../schema'
import { dbTemplate } from './templates/db'
import { gitignoreTemplate } from './templates/gitignore'
import { initModelsTemplate } from './templates/initModels'
import modelTemplate from './templates/model'
import { packageJsonTemplate } from './templates/packageJson'
import { serverTemplate } from './templates/server'
import { tsconfigTemplate } from './templates/tsconfig'

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
      file('initModels', initModelsTemplate({ schema, options })),
      ...schema.models.map((model) =>
        file(pascalCase(model.name), modelTemplate({ schema, options, model })),
      ),
    ]),
    file('.gitignore', gitignoreTemplate()),
    file('db.ts', dbTemplate({ schema, options })),
    file('package.json', packageJsonTemplate({ schema, options })),
    file('server.ts', serverTemplate()),
    file('tsconfig.json', tsconfigTemplate()),
  ])
