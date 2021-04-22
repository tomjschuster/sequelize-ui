import {
  FileItem,
  FileSystemItem,
  findFile,
  findItem,
  isDirectory,
  isFile,
  listPaths,
} from '@lib/core'
import usePrevious from '@lib/ui/hooks/usePrevious'
import React from 'react'
import { FolderState } from './types'

type UseFileTreeArgs = {
  root: FileSystemItem
  cacheKey?: string
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

function useFileTree({ root, cacheKey }: UseFileTreeArgs): UseFileTreeResult {
  const previousCacheKey = usePrevious(cacheKey)
  const [activePath, setActivePath] = React.useState<string | undefined>()

  const [folderState, setFolderState] = React.useState<FolderState>(() => createFolderState(root))

  React.useEffect(() => {
    if (cacheKey && (!previousCacheKey || cacheKey === previousCacheKey)) return
    setActivePath(undefined)
    setFolderState(createFolderState(root))
  }, [root, cacheKey, previousCacheKey])

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

function createFolderState(root: FileSystemItem): FolderState {
  return listPaths(root).reduce<{ [key: string]: boolean }>((acc, x) => {
    acc[x] = true
    return acc
  }, {})
}

export default useFileTree
