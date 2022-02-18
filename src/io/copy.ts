import { FileItem } from '@src/core/files/fileSystem'
import copy from 'copy-to-clipboard'

export function copyFile(file: FileItem): void {
  copy(file.content)
}
