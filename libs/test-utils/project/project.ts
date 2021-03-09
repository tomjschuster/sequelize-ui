import { DirectoryItem } from '@libs/core'

export interface Project {
  build(directory: DirectoryItem, preinstall?: string): Promise<void>
  destroy(name: string): Promise<void>
}
