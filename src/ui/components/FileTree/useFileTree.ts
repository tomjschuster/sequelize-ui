import { FileSystemItem, findFile, findItem, isDirectory, isFile, listPaths } from '@src/core/files'
import usePrevious from '@src/ui/hooks/usePrevious'
import React from 'react'
import { ActiveFile, FolderState } from './types'

type UseFileTreeArgs = {
  root: FileSystemItem | undefined
  defaultPath?: string
  cacheKey?: string
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
    if (defaultPath && !activePath) setActivePath(defaultPath)
  }, [defaultPath, activePath])

  // Handle first folder state and cache key changes which require new folder state
  React.useEffect(() => {
    // we only update folder state when the first root is available or when cache key changes
    if (!root || (previousRoot && cacheKey && cacheKey === previousCacheKey)) return

    // clear active path when cache key changes, but not for first root
    if (previousRoot) setActivePath(undefined)

    setFolderState(createFolderState(root))
  }, [root, previousRoot, cacheKey, previousCacheKey])

  // Whenever new paths are added, refresh the folder state
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
      if (!root) return
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
    if (!root) return undefined
    const file = activePath ? findFile(root, activePath) : undefined
    return activePath && file ? { path: activePath, file } : undefined
  }, [activePath, root])

  return { activeFile, folderState, selectItem }
}

function createFolderState(root: FileSystemItem | undefined): FolderState {
  if (!root) return {}

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
