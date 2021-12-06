import { fileLanguage } from '@src/core/files'
import * as FileTree from '@src/core/files/fileTree'
import Code from '@src/ui/components/Code'
import FileTreeView from '@src/ui/components/FileTreeView'
import React from 'react'
import * as Styles from './styles'

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
    <div className={Styles.grid}>
      <div className={Styles.fileTreeCell}>
        <FileTreeView onSelect={onSelectFileSystemItem} onKeyDown={onKeyDown} fileTree={fileTree} />
      </div>
      <div className={Styles.codeCell}>
        <Code
          content={activeFile?.content || ''}
          language={activeFile && fileLanguage(activeFile)}
        />
      </div>
    </div>
  )
}
