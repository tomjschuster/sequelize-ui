import {
  FileItem,
  FileSystemItem,
  findItem,
  isFile,
  listPaths,
  parentDirectory,
  parentDirectoryPathParts,
} from '@src/core/files'
import { listDirectoryPaths, pathFilename } from './fileSystem'

export type FileTreeState = {
  folderState: FolderState
  activeFile?: ActiveFile
  focusedPath: string
}

export type FolderState = { [path: string]: boolean }

export type ActiveFile = {
  file: FileItem
  path: string
}

export function emptyFileTreeState(): FileTreeState {
  // TODO consider focusedPath undefined
  return { folderState: {}, focusedPath: '' }
}

export function createFileTreeState(root: FileSystemItem, initialPath?: string): FileTreeState {
  const folderState = listDirectoryPaths(root).reduce<{ [key: string]: boolean }>((acc, x) => {
    acc[x] = false
    return acc
  }, {})

  const fileTree = { folderState, focusedPath: root.name }
  const item = initialPath !== undefined && findItem(root, initialPath)

  return item && isFile(item) && initialPath
    ? selectFileTreeItem(fileTree, item, initialPath)
    : fileTree
}

export function refreshFileTreeState(fileTree: FileTreeState, root: FileSystemItem): FileTreeState {
  const folderState = listDirectoryPaths(root).reduce<{ [key: string]: boolean }>((acc, x) => {
    acc[x] = x in fileTree.folderState ? fileTree.folderState[x] : false
    return acc
  }, {})

  return { ...fileTree, folderState }
}

export function selectFileTreeItem(
  fileTree: FileTreeState,
  root: FileSystemItem,
  path: string,
): FileTreeState {
  const item = findItem(root, path)

  if (!item) {
    return fileTree
  }

  if (isFile(item)) {
    return setActiveFile(fileTree, item, path)
  }

  return toggleFolder(fileTree, path)
}

function setActiveFile(fileTree: FileTreeState, file: FileItem, path: string): FileTreeState {
  const expandedTree = expandAncestors(fileTree, path)
  return { ...expandedTree, activeFile: { file, path }, focusedPath: path }
}

function setFocusedPath(fileTree: FileTreeState, focusedPath: string): FileTreeState {
  const expandedTree = expandAncestors(fileTree, focusedPath)
  return { ...expandedTree, focusedPath }
}

function toggleFolder(fileTree: FileTreeState, path: string): FileTreeState {
  const expandedTree = expandAncestors(fileTree, path)
  const currValue = expandedTree.folderState[path]

  return currValue !== undefined
    ? {
        ...expandedTree,
        folderState: { ...expandedTree.folderState, [path]: !currValue },
        focusedPath: path,
      }
    : expandedTree
}

export function expandFolder(fileTree: FileTreeState, path: string): FileTreeState {
  return path in fileTree.folderState
    ? { ...fileTree, folderState: { ...fileTree.folderState, [path]: true } }
    : fileTree
}

export function collapseFolder(fileTree: FileTreeState, path: string): FileTreeState {
  return path in fileTree.folderState
    ? { ...fileTree, folderState: { ...fileTree.folderState, [path]: false } }
    : fileTree
}

export function focusOnParent(fileTree: FileTreeState, root: FileSystemItem): FileTreeState {
  const parentPath = parentDirectory(fileTree.focusedPath)
  const parent = findItem(root, parentPath)

  return parent ? setFocusedPath(fileTree, parentPath) : fileTree
}

export function focusOnPrevious(fileTree: FileTreeState, root: FileSystemItem): FileTreeState {
  const paths = listVisiblePaths(fileTree, root)
  const index = paths.indexOf(fileTree.focusedPath)
  const previousPath = index === -1 ? undefined : paths[index - 1]

  return previousPath ? setFocusedPath(fileTree, previousPath) : fileTree
}

export function focusOnNext(fileTree: FileTreeState, root: FileSystemItem): FileTreeState {
  const paths = listVisiblePaths(fileTree, root)
  const index = paths.indexOf(fileTree.focusedPath)
  const nextPath = index === -1 ? undefined : paths[index + 1]

  return nextPath ? setFocusedPath(fileTree, nextPath) : fileTree
}

export function focusOnFirst(fileTree: FileTreeState, root: FileSystemItem): FileTreeState {
  const paths = listVisiblePaths(fileTree, root)
  const firstPath = paths[0]

  return firstPath ? setFocusedPath(fileTree, firstPath) : fileTree
}

export function focusOnLast(fileTree: FileTreeState, root: FileSystemItem): FileTreeState {
  const paths = listVisiblePaths(fileTree, root)
  const lastPath = paths[paths.length - 1]

  return lastPath ? setFocusedPath(fileTree, lastPath) : fileTree
}

export function focusByChar(
  fileTree: FileTreeState,
  root: FileSystemItem,
  char: string,
): FileTreeState {
  const paths = listVisiblePaths(fileTree, root)
  const currIndex = paths.indexOf(fileTree.focusedPath)

  if (currIndex === -1) {
    return fileTree
  }

  for (let i = currIndex + 1; i < paths.length; i++) {
    if (char.toLowerCase() === pathFilename(paths[i])[0]?.toLowerCase()) {
      return setFocusedPath(fileTree, paths[i])
    }
  }

  for (let i = 0; i < currIndex; i++) {
    if (char.toLowerCase() === pathFilename(paths[i])[0]?.toLowerCase()) {
      return setFocusedPath(fileTree, paths[i])
    }
  }

  return fileTree
}

export function expandSiblings(fileTree: FileTreeState, root: FileSystemItem): FileTreeState {
  const parent = parentDirectory(fileTree.focusedPath)
  const siblings = listVisiblePaths(fileTree, root).filter(
    (path) => parentDirectory(path) === parent,
  )

  return siblings.reduce((acc, path) => expandFolder(acc, path), fileTree)
}

function listVisiblePaths(fileTree: FileTreeState, root: FileSystemItem): string[] {
  const visiblePaths: string[] = []

  let closedAncestorPath: string | undefined

  for (const path of listPaths(root)) {
    // TODO (lead with '/'?)
    if (closedAncestorPath && path.startsWith(closedAncestorPath)) {
      continue
    }

    closedAncestorPath = fileTree.folderState[path] === false ? path : undefined
    visiblePaths.push(path)
  }

  return visiblePaths
}

function expandAncestors(fileTree: FileTreeState, path: string): FileTreeState {
  const paths = parentDirectoryPathParts(path)

  const [newFileTree, _] = paths.reduce<[FileTreeState, string | undefined]>(
    ([accFileTree, accPath], curr) => {
      const nextPath = accPath ? `${accPath}/${curr}` : curr
      const nextFileTree = expandFolder(accFileTree, nextPath)
      return [nextFileTree, nextPath]
    },
    [fileTree, undefined],
  )

  return newFileTree
}
