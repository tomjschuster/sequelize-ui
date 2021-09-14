import { DirectoryItem, isDirectory } from '@src/core/files'
import { Framework, ProjectType } from '@src/core/framework'
import { generateSequelizeProject } from './project'

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
}
