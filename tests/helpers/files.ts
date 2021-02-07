import { FileSystemItem, isDirectory, name } from '../../src/files/'
import fs from 'fs/promises'
import { join } from 'path'

export const writeFiles = async (item: FileSystemItem, root: string = __dirname): Promise<void> => {
  const path = join(root, name(item))

  if (isDirectory(item)) {
    await fs.mkdir(path, { recursive: true })
    await Promise.all(item.files.map((child) => writeFiles(child, path)))
    return
  }

  return fs.writeFile(path, item.content)
}

export const deleteDirectory = (path: string): Promise<void> => fs.rm(path, { recursive: true })

export const clearDirectory = async (path: string, keep: string[] = []): Promise<void> => {
  if (await exists(path)) {
    const files = await fs.readdir(path)
    await Promise.all(files.map((filename) => removeFileMaybe(filename, path, keep)))
  }
}

const removeFileMaybe = async (filename: string, path: string, keep: string[]): Promise<void> => {
  const shouldKeep = keep.some((keepName) => join(path, filename) === join(path, keepName))

  if (!shouldKeep) {
    await fs.rm(join(path, filename), { recursive: true })
  }
}

const exists = (path: string): Promise<boolean> =>
  fs
    .stat(path)
    .then(() => true)
    .catch(() => false)
