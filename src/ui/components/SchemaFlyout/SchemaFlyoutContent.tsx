import { DbOptions } from '@src/core/database'
import { Model, Schema } from '@src/core/schema'
import { UseFileTreeResult } from '@src/ui/components/FileTree'
import React from 'react'
import CodeExplorer from '../CodeExplorer/CodeExplorer'
import ModelForm from '../ModelForm'
import ModelView from '../ModelView'
import SchemaForm from '../SchemaForm'
import SchemaView from '../SchemaView'
import { SchemaFlyoutState, SchemaFlyoutStateType } from './types'

type SchemaFlyoutContentProps = {
  schema: Schema
  dbOptions: DbOptions
  state: SchemaFlyoutState
  fileTree: UseFileTreeResult
  onViewSchema: (model?: Model) => void
  updateSchema: (schema: Schema) => void
  updateModel: (model: Model) => void
}
export default function SchemaFlyoutContent({
  schema,
  dbOptions,
  state,
  fileTree,
  onViewSchema,
  updateSchema,
  updateModel,
}: SchemaFlyoutContentProps): React.ReactElement | null {
  switch (state.type) {
    case SchemaFlyoutStateType.CODE:
      return <CodeExplorer schema={schema} dbOptions={dbOptions} fileTree={fileTree} />
    case SchemaFlyoutStateType.EDIT_SCHEMA:
      return <SchemaForm schema={state.schema} errors={state.errors} onChange={updateSchema} />
    case SchemaFlyoutStateType.VIEW_SCHEMA:
      return <SchemaView schema={schema} onClickModel={onViewSchema} />
    case SchemaFlyoutStateType.EDIT_MODEL:
      return (
        <ModelForm
          model={state.model}
          schema={schema}
          errors={state.errors}
          onChange={updateModel}
        />
      )
    case SchemaFlyoutStateType.VIEW_MODEL:
      return <ModelView model={state.model} schema={schema} onViewSchema={onViewSchema} />
  }
}
