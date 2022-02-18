import { FileSystemItem, isDirectory, itemName } from '@src/core/files/fileSystem'
import fs from 'fs/promises'
import { join } from 'path'

export async function mkdirp(path: string): Promise<void> {
  return fs.mkdir(path, { recursive: true }).then()
}

export async function writeFiles(item: FileSystemItem, root: string = __dirname): Promise<void> {
  const path = join(root, itemName(item))

  if (isDirectory(item)) {
    await fs.mkdir(path, { recursive: true })
    await Promise.all(item.files.map((child) => writeFiles(child, path)))
    return
  }

  return fs.writeFile(path, item.content)
}

export function deleteFileOrDirectory(path: string): Promise<void> {
  return fs
    .rm(path, { recursive: true })
    .catch((err) => (err.code === 'ENOENT' ? undefined : Promise.reject(err)))
}

export async function clearDirectory(path: string, keep: string[] = []): Promise<void> {
  if (await exists(path)) {
    const files = await fs.readdir(path)
    await Promise.all(files.map((filename) => removeFileMaybe(filename, path, keep)))
  }
}

async function removeFileMaybe(filename: string, path: string, keep: string[]): Promise<void> {
  const shouldKeep = keep.some((keepName) => join(path, filename) === join(path, keepName))

  if (!shouldKeep) {
    await fs.rm(join(path, filename), { recursive: true })
  }
}

export function exists(path: string): Promise<boolean> {
  return fs
    .stat(path)
    .then(() => true)
    .catch(() => false)
}

const TEST_PROJECT_DIR = '/tmp/sequelize-ui-test/'
export function tmpDirPath(...path: string[]): string {
  return join(TEST_PROJECT_DIR, ...path)
}
