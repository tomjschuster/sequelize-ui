import { DbOptions } from '@src/core/database'
import { Schema } from '@src/core/schema'
import { UseFileTreeResult } from '@src/ui/components/FileTree'
import React from 'react'
import CodeExplorer from '../CodeExplorer/CodeExplorer'
import ModelForm from '../ModelForm'
import ModelView from '../ModelView'
import SchemaForm from '../SchemaForm'
import SchemaView from '../SchemaView'
import { SchemaFlyoutMode, SchemaFlyoutModeType } from './types'

type SchemaFlyoutContentProps = {
  schema: Schema
  dbOptions: DbOptions
  mode: SchemaFlyoutMode
  fileTree: UseFileTreeResult
  onChangeMode: (mode: SchemaFlyoutMode) => void
}
export default function SchemaFlyoutContent({
  schema,
  dbOptions,
  mode,
  fileTree,
  onChangeMode,
}: SchemaFlyoutContentProps): React.ReactElement | null {
  switch (mode.type) {
    case SchemaFlyoutModeType.CODE:
      return <CodeExplorer schema={schema} dbOptions={dbOptions} fileTree={fileTree} />
    case SchemaFlyoutModeType.EDIT_SCHEMA:
      return (
        <SchemaForm
          schema={mode.schema}
          errors={mode.errors}
          onChange={(schema) => onChangeMode({ ...mode, schema })}
        />
      )
    case SchemaFlyoutModeType.VIEW_SCHEMA:
      return (
        <SchemaView
          schema={schema}
          onClickModel={(model) => onChangeMode({ type: SchemaFlyoutModeType.VIEW_MODEL, model })}
        />
      )
    case SchemaFlyoutModeType.EDIT_MODEL:
      return (
        <ModelForm
          model={mode.model}
          schema={schema}
          errors={mode.errors}
          onChange={(model) => onChangeMode({ ...mode, model })}
        />
      )
    case SchemaFlyoutModeType.VIEW_MODEL:
      return (
        <ModelView
          model={mode.model}
          schema={schema}
          onClickSchema={() => onChangeMode({ type: SchemaFlyoutModeType.VIEW_SCHEMA })}
          onClickModel={(model) => onChangeMode({ type: SchemaFlyoutModeType.VIEW_MODEL, model })}
        />
      )
  }
}
