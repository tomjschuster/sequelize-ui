import { DbOptions } from '@src/core/database'
import { fileLanguage, FileTreeState } from '@src/core/files'
import { Schema } from '@src/core/schema'
import Code from '@src/ui/components/Code'
import FileTree from '@src/ui/components/FileTree'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import React from 'react'
import * as Styles from './styles'

export type CodeExplorerProps = {
  schema: Schema
  dbOptions: DbOptions
  fileTree: FileTreeState
  onSelectFileSystemItem: (path: string) => void
  onKeyDown: (evt: React.KeyboardEvent) => void
}
export default function CodeExplorer({
  schema,
  dbOptions,
  fileTree,
  onSelectFileSystemItem,
  onKeyDown,
}: CodeExplorerProps): React.ReactElement | null {
  const { root } = useGeneratedCode({ schema, dbOptions })

  if (!root) return null

  return (
    <div className={Styles.grid}>
      <div className={Styles.fileTreeCell}>
        <FileTree
          root={root}
          onSelect={onSelectFileSystemItem}
          onKeyDown={onKeyDown}
          activePath={fileTree.activeFile?.path}
          focusedPath={fileTree.focusedPath}
          folderState={fileTree.folderState}
        />
      </div>
      <div className={Styles.codeCell}>
        <Code
          content={fileTree.activeFile?.file.content || ''}
          language={fileTree.activeFile && fileLanguage(fileTree.activeFile.file)}
        />
      </div>
    </div>
  )
}
