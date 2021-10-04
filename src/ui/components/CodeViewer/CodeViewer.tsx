import { DbOptions, defaultDbOptions } from '@src/core/database'
import { fileLanguage } from '@src/core/files'
import { Schema } from '@src/core/schema'
import { emptySchemaErrors } from '@src/core/validation/schema'
import Code from '@src/ui/components/Code'
import FileTree, { useFileTree } from '@src/ui/components/FileTree'
import Flyout from '@src/ui/components/Flyout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import React, { useState } from 'react'
import CodeViewerControls from './CodeViewerControls'
import SchemaForm from './SchemaForm'
import SchemaFormControls from './SchemaFormControls'
import * as Styles from './styles'

export enum CodeViewerMode {
  VIEW = 'view',
  EDIT = 'edit',
}

type CodeViewerProps = {
  schema: Schema
  onClickClose: () => void
  onClickEdit?: () => void
  onClickSave: () => void
  onClickCancel: () => void
  mode: CodeViewerMode
}
export default function CodeViewer({
  schema,
  onClickClose,
  onClickEdit,
  onClickCancel,
  onClickSave,
  mode = CodeViewerMode.VIEW,
}: CodeViewerProps): React.ReactElement | null {
  console.log({ mode })
  const [dbOptions, setDbOptions] = useState<DbOptions>(defaultDbOptions)
  const { root, defaultPath } = useGeneratedCode({ schema, dbOptions })

  const { activeFile, folderState, selectItem } = useFileTree({
    root,
    cacheKey: schema.id,
    defaultPath,
  })

  if (!root) return null

  return (
    <Flyout
      title={root.name}
      onClickClose={onClickClose}
      controls={
        mode === CodeViewerMode.VIEW ? (
          <CodeViewerControls
            root={root}
            activeFile={activeFile}
            dbOptions={dbOptions}
            onClickEdit={onClickEdit}
            onChangeDbOptions={setDbOptions}
          />
        ) : (
          <SchemaFormControls onClickSave={onClickSave} onClickCancel={onClickCancel} />
        )
      }
    >
      {mode === CodeViewerMode.VIEW ? (
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
      ) : (
        <div>
          <SchemaForm schema={schema} errors={emptySchemaErrors} onChange={() => null} />
        </div>
      )}
    </Flyout>
  )
}
