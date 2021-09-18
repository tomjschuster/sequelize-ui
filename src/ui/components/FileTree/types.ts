import { FileItem } from '@src/core/files'

export type FolderState = { [path: string]: boolean }
export type ActiveFile = {
  file: FileItem
  path: string
}
