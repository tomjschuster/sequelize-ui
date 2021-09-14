import {
  FileItem,
  FileSystemItem,
  findFile,
  findItem,
  isDirectory,
  isFile,
  listPaths,
} from '@src/core/files'
import usePrevious from '@src/ui/hooks/usePrevious'
import React from 'react'
import { FolderState } from './types'

type UseFileTreeArgs = {
  root: FileSystemItem
  defaultPath?: string
  cacheKey?: string
}

type ActiveFile = {
  file: FileItem
  path: string
}

type UseFileTreeResult = {
  folderState: FolderState
  activeFile?: ActiveFile
  selectItem: (path: string) => void
}

function useFileTree({ root, cacheKey, defaultPath }: UseFileTreeArgs): UseFileTreeResult {
  const previousCacheKey = usePrevious(cacheKey)
  const previousRoot = usePrevious(root)
  const [activePath, setActivePath] = React.useState<string | undefined>(defaultPath)

  const [folderState, setFolderState] = React.useState<FolderState>(() => createFolderState(root))

  React.useEffect(() => {
    if (cacheKey && (!previousCacheKey || cacheKey === previousCacheKey)) return
    setActivePath(undefined)
    setFolderState(createFolderState(root))
  }, [root, cacheKey, previousCacheKey])

  React.useEffect(() => {
    if (root && isDirectory(root) && previousRoot) {
      const previousPaths = listPaths(previousRoot)
      const paths = listPaths(root)
      const newPaths = paths.filter((path) => !previousPaths.includes(path))
      if (newPaths.length > 0) setFolderState(refreshFolderState(folderState, root))
    }
  }, [root, previousRoot, folderState])

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

function refreshFolderState(state: FolderState, root: FileSystemItem): FolderState {
  return listPaths(root).reduce<{ [key: string]: boolean }>((acc, x) => {
    acc[x] = x in state ? state[x] : true
    return acc
  }, {})
}

export default useFileTree
