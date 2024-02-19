import {
  directory,
  FileItem,
  FileSystemItem,
  findItem,
  isDirectory,
  isFile,
  itemName,
  listPaths,
  parentDirectory,
  parentDirectoryPathParts,
  pathFilename,
  withPaths,
} from './fileSystem'

export type FileTree = {
  state: FileTreeState
  root: FileSystemItem
}

type FileTreeState = {
  paths: string[]
  visiblePaths: string[]
  items: FileSystemItemCache
  directoryState: DirectoryState
  focusedPath: string
  activePath?: string
}

type DirectoryState = Map<string, boolean>
type FileSystemItemCache = Map<string, FileSystemItem>

/** CRUD */
// CREATE
export function empty(): FileTree {
  return { root: directory('', []), state: emptyState() }
}

export function create(root: FileSystemItem, initialPath?: string): FileTree {
  return { root, state: createState(root, initialPath) }
}

// UPDATE
export function updateRoot(fileTree: FileTree, root: FileSystemItem): FileTree {
  return { root, state: updateRootState(fileTree.state, root) }
}

export function selectItem(fileTree: FileTree, path: string): FileTree {
  return mapState(fileTree, (state, root) => selectItemState(state, root, path))
}

export function selectFileTreeFocusedItem(fileTree: FileTree): FileTree {
  return mapState(fileTree, (state, root) => selectItemState(state, root, state.focusedPath))
}

export function expandDirectory(fileTree: FileTree, path: string): FileTree {
  return mapState(fileTree, (state, root) => expandDirectoryState(state, root, path))
}

export function collapseDirectory(fileTree: FileTree, path: string): FileTree {
  return mapState(fileTree, (state, root) => collapseDirectoryState(state, root, path))
}

export function focusOnParent(fileTree: FileTree): FileTree {
  return mapState(fileTree, focusOnParentState)
}

export function focusOnPrevious(fileTree: FileTree): FileTree {
  return mapState(fileTree, focusOnPreviousState)
}

export function focusOnNext(fileTree: FileTree): FileTree {
  return mapState(fileTree, focusOnNextState)
}

export function focusOnFirst(fileTree: FileTree): FileTree {
  return mapState(fileTree, focusOnFirstState)
}

export function focusOnLast(fileTree: FileTree): FileTree {
  return mapState(fileTree, focusOnLastState)
}

export function focusByChar(fileTree: FileTree, char: string): FileTree {
  return mapState(fileTree, (state) => focusByCharState(state, char))
}

export function expandSiblings(fileTree: FileTree): FileTree {
  return mapState(fileTree, expandSiblingsState)
}

export function expandFocusedDirectory(fileTree: FileTree): FileTree {
  return expandDirectory(fileTree, fileTree.state.focusedPath)
}

export function collapseFocusedDirectory(fileTree: FileTree): FileTree {
  return collapseDirectory(fileTree, fileTree.state.focusedPath)
}

// READ
export function rootItem(fileTree: FileTree): FileSystemItem {
  return fileTree.root
}

export function hasActiveFile(fileTree: FileTree): boolean {
  return !!fileTree.state.activePath
}

export function isFocused(fileTree: FileTree, path: string): boolean {
  return fileTree.state.focusedPath === path
}

export function isActive(fileTree: FileTree, path: string): boolean {
  return fileTree.state.activePath === path
}

export function activeFileItem(fileTree: FileTree): FileItem | undefined {
  const item = fileTree.state.activePath
    ? fileTree.state.items.get(fileTree.state.activePath)
    : undefined

  return item && isFile(item) ? item : undefined
}

export function activeFilePath(fileTree: FileTree): string | undefined {
  return fileTree.state.activePath
}

export function focusedFilePath(fileTree: FileTree): string {
  return fileTree.state.focusedPath
}

export function directoryIsExpanded(fileTree: FileTree, path: string): boolean {
  return fileTree.state.directoryState.get(path) || false
}

export function fileTreeFocusedOnDirectory(fileTree: FileTree): boolean {
  return fileTree.state.directoryState.has(fileTree.state.focusedPath)
}

export function focusedDirectoryIsExpanded(fileTree: FileTree): boolean {
  return !!fileTree.state.directoryState.get(fileTree.state.focusedPath)
}

export function focusedDirectoryIsCollapsed(fileTree: FileTree): boolean {
  return !fileTree.state.directoryState.get(fileTree.state.focusedPath)
}

function mapState(
  fileTree: FileTree,
  fn: (state: FileTreeState, root: FileSystemItem) => FileTreeState,
) {
  return { ...fileTree, state: fn(fileTree.state, fileTree.root) }
}

function emptyState(): FileTreeState {
  // TODO consider focusedPath undefined
  return {
    items: new Map(),
    paths: [],
    visiblePaths: [],
    directoryState: new Map(),
    focusedPath: '',
  }
}

function createState(root: FileSystemItem, initialPath?: string): FileTreeState {
  return updateRootState(emptyState(), root, initialPath)
}

function updateRootState(
  state: FileTreeState,
  root: FileSystemItem,
  initialPath?: string,
): FileTreeState {
  const itemsWithPaths = withPaths(root)
  const paths = itemsWithPaths.map(([path, _]) => path)
  const items = new Map(itemsWithPaths)
  const rootPath = itemName(root)

  const directoryState = itemsWithPaths.reduce(
    (acc, [path, item]) =>
      isDirectory(item) ? acc.set(path, state.directoryState.get(path) || false) : acc,
    new Map(),
  )

  const activePath =
    initialPath && items.has(initialPath)
      ? initialPath
      : state.activePath && items.has(state.activePath)
        ? state.activePath
        : itemsWithPaths.find(([_, item]) => isFile(item))?.[0]

  const focusedPath = activePath
    ? activePath
    : items.has(state.focusedPath)
      ? state.focusedPath
      : rootPath

  const initialState = {
    ...state,
    paths,
    visiblePaths: [],
    items,
    directoryState,
    focusedPath,
    activePath,
  }

  return selectItemState(initialState, root, activePath || rootPath)
}

function updateVisiblePaths(state: FileTreeState, root: FileSystemItem): FileTreeState {
  return { ...state, visiblePaths: listVisiblePaths(state, root) }
}

function selectItemState(state: FileTreeState, root: FileSystemItem, path: string): FileTreeState {
  const item = state.items.get(path)

  if (!item) {
    return state
  }

  const updatedState = isFile(item) ? setActiveFile(state, path) : toggleFolder(state, path)

  return updateVisiblePaths(updatedState, root)
}

function expandDirectoryState(
  state: FileTreeState,
  root: FileSystemItem,
  path: string,
): FileTreeState {
  return state.directoryState.has(path)
    ? updateVisiblePaths(
        { ...state, directoryState: new Map(state.directoryState).set(path, true) },
        root,
      )
    : state
}

function collapseDirectoryState(
  state: FileTreeState,
  root: FileSystemItem,
  path: string,
): FileTreeState {
  return state.directoryState.has(path)
    ? updateVisiblePaths(
        { ...state, directoryState: new Map(state.directoryState).set(path, false) },
        root,
      )
    : state
}

function focusOnParentState(state: FileTreeState, root: FileSystemItem): FileTreeState {
  const parentPath = parentDirectory(state.focusedPath)
  const parent = findItem(root, parentPath)

  return parent ? setFocusedPath(state, parentPath) : state
}

function focusOnPreviousState(state: FileTreeState): FileTreeState {
  const paths = state.visiblePaths
  const index = paths.indexOf(state.focusedPath)
  const previousPath = index === -1 ? undefined : paths[index - 1]

  return previousPath ? setFocusedPath(state, previousPath) : state
}

function focusOnNextState(state: FileTreeState): FileTreeState {
  const paths = state.visiblePaths
  const index = paths.indexOf(state.focusedPath)
  const nextPath = index === -1 ? undefined : paths[index + 1]

  return nextPath ? setFocusedPath(state, nextPath) : state
}

function focusOnFirstState(state: FileTreeState): FileTreeState {
  const paths = state.visiblePaths
  const firstPath = paths[0]

  return firstPath ? setFocusedPath(state, firstPath) : state
}

function focusOnLastState(state: FileTreeState): FileTreeState {
  const paths = state.visiblePaths
  const lastPath = paths[paths.length - 1]

  return lastPath ? setFocusedPath(state, lastPath) : state
}

function focusByCharState(state: FileTreeState, char: string): FileTreeState {
  const paths = state.visiblePaths
  const currIndex = paths.indexOf(state.focusedPath)

  if (currIndex === -1) {
    return state
  }

  for (let i = currIndex + 1; i < paths.length; i++) {
    if (char.toLowerCase() === pathFilename(paths[i])[0]?.toLowerCase()) {
      return setFocusedPath(state, paths[i])
    }
  }

  for (let i = 0; i < currIndex; i++) {
    if (char.toLowerCase() === pathFilename(paths[i])[0]?.toLowerCase()) {
      return setFocusedPath(state, paths[i])
    }
  }

  return state
}

function expandSiblingsState(state: FileTreeState, root: FileSystemItem): FileTreeState {
  const parent = parentDirectory(state.focusedPath)

  const directoryState = state.visiblePaths
    .filter((path) => parentDirectory(path) === parent)
    .reduce((acc, path) => acc.set(path, true), new Map(state.directoryState))

  return updateVisiblePaths({ ...state, directoryState }, root)
}

function setActiveFile(state: FileTreeState, path: string): FileTreeState {
  const expandedTree = expandAncestors(state, path)
  return { ...expandedTree, focusedPath: path, activePath: path }
}

function setFocusedPath(state: FileTreeState, focusedPath: string): FileTreeState {
  return { ...state, focusedPath }
}

function toggleFolder(state: FileTreeState, path: string): FileTreeState {
  const expandedTree = expandAncestors(state, path)
  const currValue = expandedTree.directoryState.get(path)

  return currValue !== undefined
    ? {
        ...expandedTree,
        directoryState: new Map(expandedTree.directoryState).set(path, !currValue),
        focusedPath: path,
      }
    : expandedTree
}

function listVisiblePaths(state: FileTreeState, root: FileSystemItem): string[] {
  const visiblePaths: string[] = []

  let closedAncestorPath: string | undefined

  for (const path of listPaths(root)) {
    // TODO (lead with '/'?)
    if (closedAncestorPath && path.startsWith(closedAncestorPath)) {
      continue
    }

    closedAncestorPath = state.directoryState.get(path) === false ? path : undefined
    visiblePaths.push(path)
  }

  return visiblePaths
}

function expandAncestors(state: FileTreeState, path: string): FileTreeState {
  const paths = parentDirectoryPathParts(path)

  const [directoryState, _] = paths.reduce<[DirectoryState, string | undefined]>(
    ([accFolderState, accPath], curr) => {
      const nextPath = accPath ? `${accPath}/${curr}` : curr
      const nextState = accFolderState.set(nextPath, true)
      return [nextState, nextPath]
    },
    [new Map(state.directoryState), undefined],
  )

  return { ...state, directoryState }
}
