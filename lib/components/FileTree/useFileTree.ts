import {
  FileItem,
  FileSystemItem,
  findFile,
  findItem,
  isDirectory,
  isFile,
  listPaths,
} from '@lib/core'
import React from 'react'
import { FolderState } from './types'

type UseFileTreeArgs = {
  root: FileSystemItem
}

type ActiveFile = {
  file: FileItem
  path: string
}

type UseFileTreeResult = {
  folderState: FolderState
  selectItem: (path: string) => void
  activeFile?: ActiveFile
}

function useFileTree({ root }: UseFileTreeArgs): UseFileTreeResult {
  const [activePath, setActivePath] = React.useState<string | undefined>()

  const [folderState, setFolderState] = React.useState<FolderState>(() =>
    listPaths(root).reduce<{ [key: string]: boolean }>((acc, x) => {
      acc[x] = true
      return acc
    }, {}),
  )

  const toggleFolder = React.useCallback(
    (path: string) =>
      setFolderState((folderState) => ({ ...folderState, [path]: !folderState[path] })),
    [],
  )

  const selectItem = React.useCallback(
    (path: string) => {
      const item = findItem(root, path)

      if (item && isFile(item)) {
        setActivePath(path)
        return
      }

      if (item && isDirectory(item)) {
        toggleFolder(path)
        return
      }
    },
    [root, toggleFolder],
  )

  const activeFile = React.useMemo<ActiveFile | undefined>(() => {
    const file = activePath ? findFile(root, activePath) : undefined
    return activePath && file ? { path: activePath, file } : undefined
  }, [activePath, root])

  return { activeFile, folderState, selectItem }
}

export default useFileTree
