export type FileSystemItem = FileItem | DirectoryItem

export type FileItem = {
  type: FileSystemItemType.File
  name: string
  content: string
}

export type DirectoryItem = {
  type: FileSystemItemType.Directory
  name: string
  files: FileSystemItem[]
}

export enum Language {
  Git = 'GIT',
  JavaScript = 'JAVASCRIPT',
  Json = 'JSON',
  TypeScript = 'TYPESCRIPT',
}

export function file(name: string, content: string): FileItem {
  return { type: FileSystemItemType.File, name, content }
}

export function directory(name: string, filesOrNull: (FileSystemItem | null)[]): DirectoryItem {
  const files = filesOrNull.filter((x): x is FileSystemItem => x !== null)
  return { type: FileSystemItemType.Directory, name, files }
}

export function itemName(item: FileSystemItem): string {
  return item.name
}

export function isDirectory(item: FileSystemItem): item is DirectoryItem {
  return item.type === FileSystemItemType.Directory
}

export function isFile(item: FileSystemItem): item is FileItem {
  return item.type === FileSystemItemType.File
}

export function fileLanguage(f: FileItem): Language | undefined {
  const extension = fileExtension(f)
  return extension ? languageFromExtension(extension) : undefined
}

export function findItem(
  item: FileSystemItem,
  path: string,
  startPath = '',
): FileSystemItem | undefined {
  const currPath = startPath ? `${startPath}/${item.name}` : item.name

  if (currPath === path) {
    return item
  }

  if (isDirectory(item) && path.startsWith(`${currPath}/`)) {
    return item.files.map((i) => findItem(i, path, currPath)).find((x) => !!x)
  }
}

export function findFile(item: FileSystemItem, path: string, startPath = ''): FileItem | undefined {
  const foundItem = findItem(item, path, startPath)
  return foundItem && isFile(foundItem) ? foundItem : undefined
}

export function findDirectory(
  item: FileSystemItem,
  path: string,
  startPath = '',
): DirectoryItem | undefined {
  const directory = findItem(item, path, startPath)
  return directory && isDirectory(directory) ? directory : undefined
}

export function listPaths(item: FileSystemItem): string[] {
  const name = itemName(item)
  if (isFile(item) || item.files.length === 0) {
    return [name]
  }

  return [name].concat(item.files.flatMap(listPaths).map((path) => `${name}/${path}`))
}

export function pathFilename(path: string): string {
  return path.split('/').reverse()[0]
}

export function parentDirectoryPaths(path: string): string[] {
  return path.split('/').slice(0, -1)
}

enum FileSystemItemType {
  File = 'FILE',
  Directory = 'DIRECTORY',
}

type FileExtension = KnownExtension | UnknownExtension

enum KnownExtension {
  Js = 'js',
  Json = 'json',
  Ts = 'ts',
  Gitignore = 'gitignore',
}

type UnknownExtension = string

function fileExtension(f: FileItem): string | null {
  const parts = f.name.split('.')
  return parts.length > 1 ? parts.reverse()[0] || null : null
}

function languageFromExtension(ext: FileExtension): Language | undefined {
  return isKnownExtension(ext) ? languageFromKnownExtension(ext) : undefined
}

function isKnownExtension(ext: FileExtension): ext is KnownExtension {
  return Object.values(KnownExtension).some((e) => e === ext)
}

function languageFromKnownExtension(ext: KnownExtension) {
  switch (ext) {
    case KnownExtension.Gitignore:
      return Language.Git
    case KnownExtension.Js:
      return Language.JavaScript
    case KnownExtension.Json:
      return Language.Json
    case KnownExtension.Ts:
      return Language.TypeScript
  }
}
