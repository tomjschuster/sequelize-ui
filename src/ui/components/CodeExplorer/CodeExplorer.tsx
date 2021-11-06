import { DbOptions } from '@src/core/database'
import { fileLanguage } from '@src/core/files'
import { Schema } from '@src/core/schema'
import Code from '@src/ui/components/Code'
import FileTree, { UseFileTreeResult } from '@src/ui/components/FileTree'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import React from 'react'
import * as Styles from './styles'

export type CodeExplorerProps = {
  schema: Schema
  dbOptions: DbOptions
  fileTree: UseFileTreeResult
}
export default function CodeExplorer({
  schema,
  dbOptions,
  fileTree,
}: CodeExplorerProps): React.ReactElement | null {
  const { root } = useGeneratedCode({ schema, dbOptions })
  const { activeFile, folderState, selectItem } = fileTree

  if (!root) return null

  return (
    <div className={Styles.grid}>
      <div className={Styles.fileTreeCell}>
        <FileTree
          root={root}
          onSelect={selectItem}
          activePath={activeFile?.path}
          folderState={folderState}
        />
      </div>
      <div className={Styles.codeCell}>
        <Code
          content={activeFile?.file.content || ''}
          language={activeFile && fileLanguage(activeFile.file)}
        />
      </div>
    </div>
  )
}
