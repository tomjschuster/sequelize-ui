import {
  DirectoryItem,
  FileItem,
  FileSystemItem,
  isDirectory,
  isFile,
} from '@src/core/files/fileSystem'
import { saveAs } from 'file-saver'
import Zip from 'jszip'

export const FAILED_TO_CREATE_FOLDER_ERROR = '[Zip Error] Failed to create folder'

export function download(item: FileSystemItem): Promise<void> {
  return isFile(item) ? downloadFile(item) : downloadDirectory(item)
}

function downloadDirectory(dir: DirectoryItem): Promise<void> {
  return zip(dir).then((z) =>
    z.generateAsync({ type: 'blob' }).then((blob: Blob) => saveAs(blob, dir.name)),
  )
}

function downloadFile(f: FileItem): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      saveAs(f.content, f.name)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

function zip(item: FileSystemItem): Promise<Zip> {
  return zipItem(new Zip(), item)
}

function zipItem(z: Zip, item: FileSystemItem): Promise<Zip> {
  return isDirectory(item) ? zipDirectory(z, item) : Promise.resolve(zipFile(z, item))
}

function zipFile(z: Zip, f: FileItem): Zip {
  return z.file(f.name, f.content)
}

function zipDirectory(z: Zip, dir: DirectoryItem): Promise<Zip> {
  const folder = z.folder(dir.name)
  if (!folder) return Promise.reject(Error(FAILED_TO_CREATE_FOLDER_ERROR))

  dir.files.forEach((f) => zipItem(folder, f))
  return Promise.resolve(folder)
}
