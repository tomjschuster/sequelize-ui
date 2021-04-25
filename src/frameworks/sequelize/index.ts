import { Framework, ProjectType } from '@src/core/framework'
import { generateSequelizeProject } from './project'

export const SequelizeFramework: Framework = {
  displayName: (): string => 'Sequelize',
  projectType: (): ProjectType => ProjectType.Npm,
  generate: generateSequelizeProject,
}
