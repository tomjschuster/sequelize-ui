import { DirectoryItem, isDirectory, pathFilename } from '@src/core/files'
import { Framework, ProjectType } from '@src/core/framework'
import { Model, Schema } from '@src/core/schema'
import { generateSequelizeProject } from './project'
import { modelFileName } from './utils/model'

export const SequelizeFramework: Framework = {
  displayName: (): string => 'Sequelize',
  projectType: (): ProjectType => ProjectType.Npm,
  generate: generateSequelizeProject,
  defaultFile: (root: DirectoryItem): string => {
    const firstModelFile = root.files
      .filter((item) => item.name === 'models')
      .filter(isDirectory)?.[0]
      ?.files.filter((item) => item.name !== 'index.ts')
      .sort((a, b) => a.name.localeCompare(b.name))?.[0]

    if (!firstModelFile) return `${root.name}/models/index.ts`
    return `${root.name}/models/${firstModelFile.name}`
  },
  defaultModelFile: (model: Model, root: DirectoryItem): string | undefined => {
    const modelFile = root.files
      .filter(isDirectory)
      .find((item) => item.name === 'models')
      ?.files?.find((file) => file.name === modelFileName(model))

    return modelFile && `${root.name}/models/${modelFile.name}`
  },
  modelFromPath: (path: string, schema: Schema): Model | undefined => {
    const filename = pathFilename(path)
    return schema.models.find((m) => modelFileName(m) === filename)
  },
}
