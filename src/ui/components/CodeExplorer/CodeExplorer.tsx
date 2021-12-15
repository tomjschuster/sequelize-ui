import { fileLanguage } from '@src/core/files/fileSystem'
import * as FileTree from '@src/core/files/fileTree'
import Code from '@src/ui/components/Code'
import FileTreeView from '@src/ui/components/FileTreeView'
import { classnames } from '@src/ui/styles/classnames'
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
    <div className={classnames('h-full', 'grid', 'grid-cols-12')}>
      <div
        className={classnames(
          'col-span-12',
          'lg:col-span-3',
          'row-span-3',
          'lg:row-span-12',
          'overflow-y-scroll',
          'text-gray-600',
          'border-b',
          'border-gray-900',
          'bg-gray-100',
        )}
      >
        <FileTreeView onSelect={onSelectFileSystemItem} onKeyDown={onKeyDown} fileTree={fileTree} />
      </div>
      <div
        className={classnames(
          'overflow-y-scroll',
          'row-span-9',
          'col-span-12',
          'lg:row-span-12',
          'lg:col-span-9',
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
