import { DirectoryItem } from '@src/core/files/fileSystem'

export interface Project {
  build(directory: DirectoryItem, preinstall?: string): Promise<void>
  destroy(name: string): Promise<void>
}
