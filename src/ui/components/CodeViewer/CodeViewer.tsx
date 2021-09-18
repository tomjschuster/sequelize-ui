import { DbOptions, defaultDbOptions } from '@src/core/database'
import { fileLanguage, FileSystemItem } from '@src/core/files'
import { Schema } from '@src/core/schema'
import Code from '@src/ui/components/Code'
import FileTree, { useFileTree } from '@src/ui/components/FileTree'
import Flyout from '@src/ui/components/Flyout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import React, { useState } from 'react'
import CodeViewerControls from './CodeViewerControls'
import * as Styles from './styles'

type CodeViewerProps = {
  schema: Schema
  onClickEdit?: () => void
  onClickClose: () => void
}

export default function CodeViewer({
  schema,
  onClickClose,
  onClickEdit,
}: CodeViewerProps): React.ReactElement | null {
  const [dbOptions, setDbOptions] = useState<DbOptions>(defaultDbOptions)
  const { root, defaultPath } = useGeneratedCode({ schema, dbOptions })

  if (!root) return null

  return (
    <CodeViewerContent
      schema={schema}
      root={root}
      dbOptions={dbOptions}
      defaultPath={defaultPath}
      onChangeDbOptions={setDbOptions}
      onClickClose={onClickClose}
      onClickEdit={onClickEdit}
    />
  )
}

type CodeViewerContentProps = {
  schema: Schema
  root: FileSystemItem
  dbOptions: DbOptions
  defaultPath: string | undefined
  onChangeDbOptions: (dbOptions: DbOptions) => void
  onClickClose: () => void
  onClickEdit?: () => void
}
function CodeViewerContent({
  schema,
  root,
  dbOptions,
  defaultPath,
  onChangeDbOptions,
  onClickClose,
  onClickEdit,
}: CodeViewerContentProps): React.ReactElement {
  const { activeFile, folderState, selectItem } = useFileTree({
    root,
    cacheKey: schema.id,
    defaultPath,
  })

  return (
    <Flyout
      title={root.name}
      onClickClose={onClickClose}
      controls={
        <CodeViewerControls
          root={root}
          activeFile={activeFile}
          dbOptions={dbOptions}
          onClickEdit={onClickEdit}
          onChangeDbOptions={onChangeDbOptions}
        />
      }
    >
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
    </Flyout>
  )
}
