import Zip from 'jszip'
// import { saveAs } from 'file-saver'

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

export function directory(name: string, files: FileSystemItem[]): DirectoryItem {
  return { type: FileSystemItemType.Directory, name, files }
}

export function name(item: FileSystemItem): string {
  return item.name
}

export function isDirectory(item: FileSystemItem): item is DirectoryItem {
  return item.type === FileSystemItemType.Directory
}

export function fileLanguage(item: FileItem): Language | null {
  const extension = fileExtension(item)
  return extension ? languageFromExtension(extension) : null
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

function fileExtension(item: FileItem): string | null {
  return item.name.split('.').reverse()[0] || null
}

function languageFromExtension(ext: FileExtension): Language | null {
  return isKnownExtension(ext) ? languageFromKnownExtension(ext) : null
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

// export const download = (item: FileSystemItem): Promise<void> =>
//   item.type === FileSystemItemType.File ? downloadFile(item) : downloadDirectory(item)

// const downloadFile = (item: FileItem): Promise<void> =>
//   new Promise((resolve, reject) => {
//     try {
//       saveAs(item.content, item.name)
//       resolve()
//     } catch (e) {
//       reject(e)
//     }
//   })

// const downloadDirectory = (item: DirectoryItem): Promise<void> =>
//   createZip(item).then((blob: Blob) => saveAs(blob, item.name))

// export const createZip = (item: FileSystemItem): Promise<Blob> =>
//   zipItem(new Zip(), item).generateAsync({ type: 'blob' })
export const createZip = (item: FileSystemItem): Promise<Buffer> =>
  zipItem(new Zip(), item).generateAsync({ type: 'nodebuffer' })

const zipItem = (zip: Zip, item: FileSystemItem): Zip =>
  item.type === FileSystemItemType.File ? zipFile(zip, item) : zipDirectory(zip, item) || zip

const zipFile = (zip: Zip, item: FileItem): Zip => zip.file(item.name, item.content)

const zipDirectory = (zip: Zip, item: DirectoryItem): Zip | null => {
  const folder = zip.folder(item.name)

  if (folder) {
    item.files.forEach((file) => zipItem(folder, file))
  }

  return folder
}
