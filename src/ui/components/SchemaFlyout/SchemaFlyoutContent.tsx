import { FileTree } from '@src/core/files/fileTree'
import { Model, Schema } from '@src/core/schema'
import React from 'react'
import CodeExplorer from '../CodeExplorer/CodeExplorer'
import ModelForm from '../ModelForm'
import ModelView from '../ModelView'
import SchemaForm from '../SchemaForm'
import SchemaView from '../SchemaView'
import { SchemaFlyoutState, SchemaFlyoutStateType } from './types'

type SchemaFlyoutContentProps = {
  schema: Schema
  state: SchemaFlyoutState
  fileTree: FileTree
  onSelectFileSystemItem: (path: string) => void
  onKeyDown: (evt: React.KeyboardEvent) => void
  onViewSchema: (model?: Model) => void
  updateSchema: (schema: Schema) => void
  updateModel: (model: Model) => void
  onClickAddModel: () => void
  onClickAddField: () => void
  onClickAddAssociation: () => void
}
export default function SchemaFlyoutContent({
  schema,
  state,
  fileTree,
  onSelectFileSystemItem,
  onKeyDown,
  onViewSchema,
  updateSchema,
  updateModel,
  onClickAddModel,
  onClickAddField,
  onClickAddAssociation,
}: SchemaFlyoutContentProps): React.ReactElement | null {
  switch (state.type) {
    case SchemaFlyoutStateType.CODE:
      return (
        <CodeExplorer
          fileTree={fileTree}
          onSelectFileSystemItem={onSelectFileSystemItem}
          onKeyDown={onKeyDown}
        />
      )
    case SchemaFlyoutStateType.EDIT_SCHEMA:
      return (
        <SchemaForm
          schema={state.schema}
          newModel={state.newModel}
          errors={state.errors}
          onChange={updateSchema}
        />
      )
    case SchemaFlyoutStateType.VIEW_SCHEMA:
      return (
        <SchemaView
          schema={state.schema}
          onClickModel={onViewSchema}
          onClickAddModel={onClickAddModel}
        />
      )
    case SchemaFlyoutStateType.EDIT_MODEL:
      return (
        <ModelForm
          model={state.model}
          schema={schema}
          newField={state.newField}
          newAssociation={state.newAssociation}
          errors={state.errors}
          onChange={updateModel}
        />
      )
    case SchemaFlyoutStateType.VIEW_MODEL:
      return (
        <ModelView
          model={state.model}
          schema={schema}
          onViewSchema={onViewSchema}
          onClickAddField={onClickAddField}
          onClickAddAssociation={onClickAddAssociation}
        />
      )
  }
}
