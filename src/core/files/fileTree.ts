import {
  FileItem,
  FileSystemItem,
  findItem,
  isFile,
  listPaths,
  parentDirectoryPaths,
} from '@src/core/files'

export type FileTreeState = {
  folderState: FolderState
  activeFile?: ActiveFile
}

export type FolderState = { [path: string]: boolean }

export type ActiveFile = {
  file: FileItem
  path: string
}

export function emptyFileTreeState(): FileTreeState {
  return { folderState: {} }
}

export function createFileTreeState(root: FileSystemItem, initialPath?: string): FileTreeState {
  const folderState = listPaths(root).reduce<{ [key: string]: boolean }>((acc, x) => {
    acc[x] = false
    return acc
  }, {})

  const fileTree = { folderState }
  const item = initialPath !== undefined && findItem(root, initialPath)

  return item && isFile(item) && initialPath
    ? selectFileTreeItem(fileTree, item, initialPath)
    : fileTree
}

export function refreshFileTreeState(fileTree: FileTreeState, root: FileSystemItem): FileTreeState {
  const folderState = listPaths(root).reduce<{ [key: string]: boolean }>((acc, x) => {
    acc[x] = x in fileTree.folderState ? fileTree.folderState[x] : true
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
    const paths = parentDirectoryPaths(path)

    const [newFileTree, _] = paths.reduce<[FileTreeState, string | undefined]>(
      ([accFileTree, accPath], curr) => {
        const nextPath = accPath ? `${accPath}/${curr}` : curr
        const nextFileTree = expandFolder(accFileTree, nextPath)
        return [nextFileTree, nextPath]
      },
      [fileTree, undefined],
    )

    return setActiveFile(newFileTree, item, path)
  }

  return toggleFolder(fileTree, path)
}

function setActiveFile(fileTree: FileTreeState, file: FileItem, path: string): FileTreeState {
  return { ...fileTree, activeFile: { file, path } }
}
function toggleFolder(fileTree: FileTreeState, path: string): FileTreeState {
  const currValue = fileTree.folderState[path]
  return { ...fileTree, folderState: { ...fileTree.folderState, [path]: !currValue } }
}

function expandFolder(fileTree: FileTreeState, path: string): FileTreeState {
  return { ...fileTree, folderState: { ...fileTree.folderState, [path]: true } }
}
