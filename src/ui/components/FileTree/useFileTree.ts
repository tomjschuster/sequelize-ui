import {
  createFileTreeState,
  emptyFileTreeState,
  FileSystemItem,
  FileTreeState,
  listPaths,
  refreshFileTreeState,
  selectFileTreeItem,
} from '@src/core/files'
import usePrevious from '@src/ui/hooks/usePrevious'
import React from 'react'

export type UseFileTreeArgs = {
  root: FileSystemItem | undefined
  defaultPath?: string
  key?: string
}

export type UseFileTreeResult = {
  fileTree: FileTreeState
  selectItem: (path: string) => void
}

function useFileTree({ root, key, defaultPath }: UseFileTreeArgs): UseFileTreeResult {
  const previousRoot = usePrevious(root)
  const previousKey = usePrevious(key)
  const [fileTree, setFileTree] = React.useState<FileTreeState>(() =>
    root ? createFileTreeState(root, defaultPath) : emptyFileTreeState(),
  )

  // Generate file tree when root is set for the first time
  React.useEffect(() => {
    if (!previousRoot && root) {
      setFileTree(createFileTreeState(root, defaultPath))
    }
  }, [root, previousRoot, defaultPath])

  // Select default path when there is no active file
  React.useEffect(() => {
    if (root && previousRoot && !fileTree.activeFile && defaultPath) {
      setFileTree(selectFileTreeItem(fileTree, root, defaultPath))
    }
  }, [root, previousRoot, fileTree, defaultPath])

  // Regenerate file tree when the key changes
  React.useEffect(() => {
    if (root && key !== previousKey) {
      setFileTree(createFileTreeState(root, defaultPath))
    }
  }, [root, key, previousKey, defaultPath])

  // Whenever new paths are added, refresh the folder state
  React.useEffect(() => {
    if (root && previousRoot) {
      const previousPaths = listPaths(previousRoot)
      const paths = listPaths(root)
      const newPaths = paths.filter((path) => !previousPaths.includes(path))

      if (newPaths.length > 0) {
        setFileTree(refreshFileTreeState(fileTree, root))
      }
    }
  }, [root, previousRoot, fileTree])

  const selectItem = React.useCallback(
    (path: string) => root && setFileTree(selectFileTreeItem(fileTree, root, path)),
    [fileTree, root],
  )

  return { fileTree, selectItem }
}

export default useFileTree
