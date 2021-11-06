import { FileItem, FileSystemItem } from '@src/core/files'

export type FolderState = { [path: string]: boolean }
export type ActiveFile = {
  file: FileItem
  path: string
}

export type UseFileTreeArgs = {
  root: FileSystemItem | undefined
  defaultPath?: string
  cacheKey?: string
}

export type UseFileTreeResult = {
  folderState: FolderState
  activeFile?: ActiveFile
  selectItem: (path: string) => void
}
