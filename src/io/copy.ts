import { FileItem } from '@src/core/files'
import copy from 'copy-to-clipboard'

export function copyFile(file: FileItem): void {
  copy(file.content)
}
