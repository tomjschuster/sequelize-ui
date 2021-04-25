import { DirectoryItem, FileItem, FileSystemItem, isDirectory, isFile } from '@src/core/files'
import { saveAs } from 'file-saver'
import Zip from 'jszip'

export const FAILED_TO_CREATE_FOLDER_ERROR = '[Zip Error] Failed to create folder'

export const download = (item: FileSystemItem): Promise<void> =>
  isFile(item) ? downloadFile(item) : downloadDirectory(item)

const downloadDirectory = (dir: DirectoryItem): Promise<void> =>
  zip(dir).then((z) =>
    z.generateAsync({ type: 'blob' }).then((blob: Blob) => saveAs(blob, dir.name)),
  )

const downloadFile = (f: FileItem): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      saveAs(f.content, f.name)
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const zip = (item: FileSystemItem): Promise<Zip> => zipItem(new Zip(), item)

const zipItem = (z: Zip, item: FileSystemItem): Promise<Zip> =>
  isDirectory(item) ? zipDirectory(z, item) : Promise.resolve(zipFile(z, item))

const zipFile = (z: Zip, f: FileItem): Zip => z.file(f.name, f.content)

const zipDirectory = (z: Zip, dir: DirectoryItem): Promise<Zip> => {
  const folder = z.folder(dir.name)
  if (!folder) return Promise.reject(Error(FAILED_TO_CREATE_FOLDER_ERROR))

  dir.files.forEach((f) => zipItem(folder, f))
  return Promise.resolve(folder)
}
