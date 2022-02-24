import { SchemaMeta } from '@src/api/meta'
import { DbOptions } from '@src/core/database'
import * as FileTree from '@src/core/files/fileTree'
import { Framework } from '@src/core/framework'
import { Model, Schema } from '@src/core/schema'
import { classnames, height } from '@src/ui/styles/classnames'
import { scrollToTop } from '@src/utils/dom'
import { noop } from '@src/utils/functions'
import React from 'react'
import CodeExplorer from '../../components/CodeExplorer/CodeExplorer'
import SchemaLayoutContent from './SchemaLayoutContent'
import SchemaLayoutControls, { SchemaLayoutControlsWrapper } from './SchemaLayoutControls'
import { useSchemaLayout } from './useSchemaLayout'

type SchemaLayoutProps = {
  schema: Schema
  meta?: SchemaMeta
  dbOptions: DbOptions
  initialFramework?: Framework
  initiallyEditing?: boolean
  onChangeSchema: (schema: Schema) => Promise<Schema>
  onChangeDbOptions: (dbOptions: DbOptions) => Promise<DbOptions>
  onDelete?: () => Promise<void>
  onClickClose: () => void
}
export default function SchemaLayout({
  schema,
  meta,
  dbOptions,
  initialFramework,
  initiallyEditing,
  onChangeSchema,
  onChangeDbOptions,
  onDelete,
  onClickClose,
}: SchemaLayoutProps): React.ReactElement | null {
  const {
    state,
    isEditing,
    fileTree,
    selectItem,
    handleKeyDown,
    viewCode,
    viewSchema,
    edit,
    delete_,
    updateModel,
    updateSchema,
    addModel,
    editModel,
    deleteModel,
    addField,
    editField,
    deleteField,
    addAssociation,
    editAssociation,
    deleteAssociation,
    save,
    cancel,
    back,
  } = useSchemaLayout({
    schema,
    dbOptions,
    meta,
    initialFramework,
    initiallyEditing,
    onChangeSchema,
    onChangeDbOptions,
    onExit: onClickClose,
    onDelete,
  })

  const flyoutContentRef = React.useRef() as React.MutableRefObject<HTMLDivElement>

  const handleViewSchema = React.useCallback(
    (model?: Model) => {
      if (flyoutContentRef.current) {
        scrollToTop(flyoutContentRef.current)
      }
      viewSchema(model)
    },
    [viewSchema],
  )

  return (
    <>
      <SchemaLayoutControls
        state={state}
        meta={meta}
        isEditing={isEditing}
        fileTree={fileTree}
        dbOptions={dbOptions}
        onChangeDbOptions={onChangeDbOptions}
        onSelectCode={viewCode}
        onSelectSchema={handleViewSchema}
        onEdit={edit}
        onDelete={delete_}
        onCancel={cancel}
        onSave={save}
        onClose={back}
      />
      <SchemaLayoutContent
        state={state}
        schema={schema}
        fileTree={fileTree}
        onSelectFileSystemItem={selectItem}
        onKeyDown={handleKeyDown}
        updateSchema={updateSchema}
        updateModel={updateModel}
        onViewSchema={handleViewSchema}
        onClickAddModel={addModel}
        onClickEditModel={editModel}
        onClickDeleteModel={deleteModel}
        onClickAddField={addField}
        onClickEditField={editField}
        onClickDeleteField={deleteField}
        onClickAddAssociation={addAssociation}
        onClickEditAssociation={editAssociation}
        onClickDeleteAssociation={deleteAssociation}
      />
    </>
  )
}

export function EmptySchemaLayout() {
  return (
    <>
      <SchemaLayoutControlsWrapper>
        <div className={classnames(height('h-8'))} />
      </SchemaLayoutControlsWrapper>
      <CodeExplorer fileTree={FileTree.empty()} onSelectFileSystemItem={noop} onKeyDown={noop} />
    </>
  )
}
