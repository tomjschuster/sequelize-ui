import { DirectoryItem, FileItem, FileSystemItem, isDirectory, isFile } from '@lib/core/files'
import copy from 'copy-to-clipboard'
import { saveAs } from 'file-saver'
import Zip from 'jszip'

export const copyFile = (file: FileItem): void => {
  copy(file.content)
}

export const download = (item: FileSystemItem): Promise<void> =>
  isFile(item) ? downloadFile(item) : downloadDirectory(item)

export const downloadDirectory = (dir: DirectoryItem): Promise<void> =>
  zip(dir)
    .generateAsync({ type: 'blob' })
    .then((blob: Blob) => saveAs(blob, dir.name))

const downloadFile = (f: FileItem): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      saveAs(f.content, f.name)
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const zip = (item: FileSystemItem): Zip => zipItem(new Zip(), item)

const zipItem = (z: Zip, item: FileSystemItem): Zip =>
  isDirectory(item) ? zipDirectory(z, item) || z : zipFile(z, item)

const zipFile = (z: Zip, f: FileItem): Zip => z.file(f.name, f.content)

const zipDirectory = (z: Zip, dir: DirectoryItem): Zip | null => {
  const folder = z.folder(dir.name)

  if (folder) {
    dir.files.forEach((f) => zipItem(folder, f))
  }

  return folder
}
