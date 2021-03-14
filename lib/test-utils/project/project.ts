import { DirectoryItem } from '@lib/core'

export interface Project {
  build(directory: DirectoryItem, preinstall?: string): Promise<void>
  destroy(name: string): Promise<void>
}
