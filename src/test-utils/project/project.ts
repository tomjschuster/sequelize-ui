import { FileSystemItem } from '@src/core/files/fileSystem'

export interface Project {
  build(directory: FileSystemItem, preinstall?: string): Promise<void>
  destroy(name: string): Promise<void>
}
