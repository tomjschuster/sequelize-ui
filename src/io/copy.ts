import { FileItem } from '@src/core/files'
import copy from 'copy-to-clipboard'

export const copyFile = (file: FileItem): void => {
  copy(file.content)
}
