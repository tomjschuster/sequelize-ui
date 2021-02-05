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
