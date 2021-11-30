import {
  collapseFolder,
  createFileTreeState,
  emptyFileTreeState,
  expandFolder,
  expandSiblings,
  FileSystemItem,
  FileTreeState,
  focusByChar,
  focusOnFirst,
  focusOnLast,
  focusOnNext,
  focusOnParent,
  focusOnPrevious,
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
  handleKeyDown: (evt: React.KeyboardEvent) => void
}

function useFileTree({ root, key, defaultPath }: UseFileTreeArgs): UseFileTreeResult {
  const previousRoot = usePrevious(root)
  const previousKey = usePrevious(key)

  const [fileTree, setFileTree] = React.useState<FileTreeState>(() =>
    root ? createFileTreeState(root, defaultPath) : emptyFileTreeState(),
  )

  const handleKeyDown = React.useCallback(
    (evt: React.KeyboardEvent) => {
      if (root) setFileTree(handleFileTreeKeydown(evt, fileTree, root))
    },
    [root, fileTree],
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

  return { fileTree, selectItem, handleKeyDown }
}

enum Key {
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  End = 'End',
  Enter = 'Enter',
  Home = 'Home',
  Space = ' ',
}

function handleFileTreeKeydown(
  evt: React.KeyboardEvent,
  fileTree: FileTreeState,
  root: FileSystemItem,
): FileTreeState {
  if (!isFileTreeKeydown(evt)) {
    return fileTree
  }

  evt.preventDefault()
  evt.stopPropagation()

  switch (evt.key) {
    case Key.Space:
      return selectFileTreeItem(fileTree, root, fileTree.focusedPath)

    case Key.Enter:
      return selectFileTreeItem(fileTree, root, fileTree.focusedPath)

    case Key.ArrowUp:
      return focusOnPrevious(fileTree, root)

    case Key.ArrowDown:
      return focusOnNext(fileTree, root)

    case Key.ArrowRight:
      if (!(fileTree.focusedPath in fileTree.folderState)) {
        return fileTree
      }

      return fileTree.folderState[fileTree.focusedPath]
        ? focusOnNext(fileTree, root)
        : expandFolder(fileTree, fileTree.focusedPath)

    case Key.ArrowLeft:
      return fileTree.folderState[fileTree.focusedPath]
        ? collapseFolder(fileTree, fileTree.focusedPath)
        : focusOnParent(fileTree, root)

    case Key.Home:
      return focusOnFirst(fileTree, root)

    case Key.End:
      return focusOnLast(fileTree, root)

    case '*':
      return expandSiblings(fileTree, root)

    default:
      return focusByChar(fileTree, root, evt.key)
  }
}

function isFileTreeKeydown(evt: React.KeyboardEvent): boolean {
  if (evt.altKey || evt.ctrlKey || evt.metaKey) return false
  return /^[\w*]$/.test(evt.key) || Object.values(Key).some((key) => key === evt.key)
}

export default useFileTree
