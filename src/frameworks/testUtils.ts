import { FileItem, FileSystemItem, isFile, withPathsBreadthFirst } from '@src/core/files/fileSystem'

function jsDoc(value: string): string {
  const leftPad = Math.max(0, 38 - Math.ceil(value.length / 2))
  const rightPad = Math.max(0, 38 - Math.floor(value.length / 2))
  return [
    `/${'*'.repeat(78)}`,
    ` *${' '.repeat(leftPad)}${value}${' '.repeat(rightPad)}*`,
    ` ${'*'.repeat(78)}/`,
  ].join('\n')
}

export function printFileSystemItem(item: FileSystemItem, onlyPaths?: string[]): string {
  return withPathsBreadthFirst(item)
    .filter(
      (value): value is [string, FileItem] =>
        isFile(value[1]) && (!onlyPaths || onlyPaths.includes(value[0])),
    )
    .map(([path, file]) => `\n${jsDoc('/' + path)}\n\n${file.content}\n`)
    .join('')
}
