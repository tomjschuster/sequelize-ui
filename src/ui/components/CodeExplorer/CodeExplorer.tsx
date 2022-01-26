import { fileLanguage } from '@src/core/files/fileSystem'
import * as FileTree from '@src/core/files/fileTree'
import Code from '@src/ui/components/Code'
import FileTreeView from '@src/ui/components/FileTreeView'
import {
  borderColor,
  borderWidth,
  classnames,
  display,
  flex,
  gridColumn,
  gridRow,
  gridTemplateColumns,
  gridTemplateRows,
  height,
  overflow,
} from '@src/ui/styles/classnames'
import React from 'react'

export type CodeExplorerProps = {
  fileTree: FileTree.FileTree
  onSelectFileSystemItem: (path: string) => void
  onKeyDown: (evt: React.KeyboardEvent) => void
}
export default function CodeExplorer({
  fileTree,
  onSelectFileSystemItem,
  onKeyDown,
}: CodeExplorerProps): React.ReactElement | null {
  const activeFile = FileTree.activeFileItem(fileTree)

  return (
    <div
      className={classnames(
        height('h-full'),
        flex('flex-1'),
        display('grid'),
        gridTemplateColumns('grid-cols-12'),
        gridTemplateRows('grid-rows-12'),
        overflow('overflow-hidden'),
      )}
    >
      <div
        className={classnames(
          gridColumn('col-span-12', 'lg:col-span-3'),
          gridRow('row-span-3', 'lg:row-span-12'),
          overflow('overflow-y-scroll'),
          borderWidth('border-b'),
          borderColor('border-gray-900'),
          borderColor('dark:border-gray-500'),
        )}
      >
        <FileTreeView onSelect={onSelectFileSystemItem} onKeyDown={onKeyDown} fileTree={fileTree} />
      </div>
      <div
        className={classnames(
          overflow('overflow-y-hidden'),
          gridColumn('col-span-12', 'lg:col-span-9'),
          gridRow('row-span-9', 'lg:row-span-12'),
        )}
      >
        <Code
          content={activeFile?.content || ''}
          language={activeFile && fileLanguage(activeFile)}
        />
      </div>
    </div>
  )
}
