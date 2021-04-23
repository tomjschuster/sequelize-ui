import { DirectoryItem } from '@src/core/files'
import { ProjectType } from '@src/core/framework'
import { NpmProject } from './npm'

export const buildProject = (
  projectType: ProjectType,
  directory: DirectoryItem,
  preinstall?: string,
): Promise<void> => {
  switch (projectType) {
    case ProjectType.Npm:
      return NpmProject.build(directory, preinstall)
  }
}

export const destroyProject = (projectType: ProjectType, name: string): Promise<void> => {
  switch (projectType) {
    case ProjectType.Npm:
      return NpmProject.destroy(name)
  }
}
