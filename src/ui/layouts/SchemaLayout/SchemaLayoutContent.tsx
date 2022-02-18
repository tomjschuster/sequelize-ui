import { FileTree } from '@src/core/files/fileTree'
import { Association, Field, Model, Schema } from '@src/core/schema'
import dynamic from 'next/dynamic'
import React from 'react'
import CodeExplorer from '../../components/CodeExplorer/CodeExplorer'
import { SchemaLayoutState, SchemaLayoutStateType } from './types'

const SchemaView = dynamic(() => import('../../components/SchemaView'))
const SchemaForm = dynamic(() => import('../../components/SchemaForm'))
const ModelView = dynamic(() => import('../../components/ModelView'))
const ModelForm = dynamic(() => import('../../components/ModelForm'))

type SchemaLayoutContentProps = {
  schema: Schema
  state: SchemaLayoutState
  fileTree: FileTree
  onSelectFileSystemItem: (path: string) => void
  onKeyDown: (evt: React.KeyboardEvent) => void
  onViewSchema: (model?: Model) => void
  updateSchema: (schema: Schema) => void
  updateModel: (model: Model) => void
  onClickAddModel: () => void
  onClickEditModel: (field: Model) => void
  onClickDeleteModel: (field: Model) => void
  onClickAddField: () => void
  onClickEditField: (field: Field) => void
  onClickDeleteField: (field: Field) => void
  onClickAddAssociation: () => void
  onClickEditAssociation: (field: Association) => void
  onClickDeleteAssociation: (field: Association) => void
}
export default function SchemaLayoutContent({
  schema,
  state,
  fileTree,
  onSelectFileSystemItem,
  onKeyDown,
  onViewSchema,
  updateSchema,
  updateModel,
  onClickAddModel,
  onClickDeleteModel,
  onClickEditModel,
  onClickAddField,
  onClickDeleteField,
  onClickEditField,
  onClickAddAssociation,
  onClickEditAssociation,
  onClickDeleteAssociation,
}: SchemaLayoutContentProps): React.ReactElement | null {
  switch (state.type) {
    case SchemaLayoutStateType.CODE:
      return (
        <CodeExplorer
          fileTree={fileTree}
          onSelectFileSystemItem={onSelectFileSystemItem}
          onKeyDown={onKeyDown}
        />
      )
    case SchemaLayoutStateType.EDIT_SCHEMA:
      return (
        <SchemaForm
          schema={state.schema}
          newModel={state.newModel}
          errors={state.errors}
          onChange={updateSchema}
        />
      )
    case SchemaLayoutStateType.VIEW_SCHEMA:
      return (
        <SchemaView
          schema={state.schema}
          onClickModel={onViewSchema}
          onClickAddModel={onClickAddModel}
          onClickEditModel={onClickEditModel}
          onClickDeleteModel={onClickDeleteModel}
        />
      )
    case SchemaLayoutStateType.EDIT_MODEL:
      return (
        <ModelForm
          model={state.model}
          schema={schema}
          initialState={state.initialState}
          errors={state.errors}
          onChange={updateModel}
        />
      )
    case SchemaLayoutStateType.VIEW_MODEL:
      return (
        <ModelView
          model={state.model}
          schema={schema}
          onViewSchema={onViewSchema}
          onClickAddField={onClickAddField}
          onClickEditField={onClickEditField}
          onClickDeleteField={onClickDeleteField}
          onClickAddAssociation={onClickAddAssociation}
          onClickEditAssociation={onClickEditAssociation}
          onClickDeleteAssociation={onClickDeleteAssociation}
        />
      )
  }
}
