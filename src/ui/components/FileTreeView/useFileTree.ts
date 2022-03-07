import { FileSystemItem } from '@src/core/files/fileSystem'
import * as FileTree from '@src/core/files/fileTree'
import usePrevious from '@src/ui/hooks/usePrevious'
import { Key } from '@src/utils/dom'
import React from 'react'

export type UseFileTreeArgs = {
  root: FileSystemItem | undefined
  defaultPath?: string
  key?: string
}

export type UseFileTreeResult = {
  fileTree: FileTree.FileTree
  selectItem: (path: string) => void
  handleKeyDown: (evt: React.KeyboardEvent) => void
}

function useFileTree({ root, key, defaultPath }: UseFileTreeArgs): UseFileTreeResult {
  const previousRoot = usePrevious(root)
  const previousKey = usePrevious(key)

  const [fileTree, setFileTree] = React.useState<FileTree.FileTree>(() =>
    root ? FileTree.create(root, defaultPath) : FileTree.empty(),
  )

  const handleKeyDown = React.useCallback(
    (evt: React.KeyboardEvent) => setFileTree(handleFileTreeKeydown(fileTree, evt)),
    [fileTree],
  )

  React.useEffect(() => {
    if (!root) {
      return
    }

    const isFirst = !previousRoot && root
    const isNew = key !== previousKey

    if (isFirst || isNew) {
      setFileTree(FileTree.create(root, defaultPath))
      return
    }

    const hasChanged = root !== previousRoot

    if (hasChanged) {
      setFileTree(FileTree.updateRoot(fileTree, root))
      return
    }
  }, [root, previousRoot, key, previousKey, defaultPath, fileTree])

  // Select default path when there is no active file
  React.useEffect(() => {
    if (root && previousRoot && !FileTree.hasActiveFile(fileTree) && defaultPath) {
      setFileTree(FileTree.selectItem(fileTree, defaultPath))
    }
  }, [root, previousRoot, fileTree, defaultPath])

  const selectItem = React.useCallback(
    (path: string) => setFileTree(FileTree.selectItem(fileTree, path)),
    [fileTree],
  )

  return { fileTree, selectItem, handleKeyDown }
}

function handleFileTreeKeydown(
  fileTree: FileTree.FileTree,
  evt: React.KeyboardEvent,
): FileTree.FileTree {
  if (!isFileTreeKeydown(evt)) {
    return fileTree
  }

  evt.preventDefault()
  evt.stopPropagation()

  switch (evt.key) {
    case Key.Space:
      return FileTree.selectFileTreeFocusedItem(fileTree)

    case Key.Enter:
      return FileTree.selectFileTreeFocusedItem(fileTree)

    case Key.ArrowUp:
      return FileTree.focusOnPrevious(fileTree)

    case Key.ArrowDown:
      return FileTree.focusOnNext(fileTree)

    case Key.ArrowRight:
      if (!FileTree.fileTreeFocusedOnDirectory(fileTree)) {
        return fileTree
      }

      return FileTree.focusedDirectoryIsExpanded(fileTree)
        ? FileTree.focusOnNext(fileTree)
        : FileTree.expandFocusedDirectory(fileTree)

    case Key.ArrowLeft:
      return FileTree.focusedDirectoryIsExpanded(fileTree)
        ? FileTree.collapseFocusedDirectory(fileTree)
        : FileTree.focusOnParent(fileTree)

    case Key.Home:
      return FileTree.focusOnFirst(fileTree)

    case Key.End:
      return FileTree.focusOnLast(fileTree)

    case '*':
      return FileTree.expandSiblings(fileTree)

    default:
      return FileTree.focusByChar(fileTree, evt.key)
  }
}

function isFileTreeKeydown(evt: React.KeyboardEvent): boolean {
  if (evt.altKey || evt.ctrlKey || evt.metaKey || evt.key === Key.Tab) return false
  return /^[\w*]$/.test(evt.key) || Object.values(Key).some((key) => key === evt.key)
}

export default useFileTree
