import { FileSystemItem } from '@src/core/files/fileSystem'
import { ProjectType } from '@src/core/framework'
import { NpmProject } from './npm'

export function buildProject(
  projectType: ProjectType,
  directory: FileSystemItem,
  preinstall?: string,
): Promise<void> {
  switch (projectType) {
    case ProjectType.Npm:
      return NpmProject.build(directory, preinstall)
  }
}

export function destroyProject(projectType: ProjectType, name: string): Promise<void> {
  switch (projectType) {
    case ProjectType.Npm:
      return NpmProject.destroy(name)
  }
}
