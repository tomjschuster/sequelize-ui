import { defaultDbOptions } from '@src/core/database'
import { itemName } from '@src/core/files/fileSystem'
import * as FileTree from '@src/core/files/fileTree'
import { emptySchema, Model, Schema } from '@src/core/schema'
import Flyout from '@src/ui/components/Flyout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import { scrollToTop } from '@src/utils/dom'
import React from 'react'
import SchemaFlyoutContent from './SchemaFlyoutContent'
import SchemaFlyoutControls from './SchemaFlyoutControls'
import { useSchemaFlyout } from './useSchemaFlyout'

type SchemaFlyoutProps = {
  schema: Schema
  schemas: Schema[]
  onChange: (schema: Schema) => Promise<Schema>
  onDelete?: () => Promise<void>
  onClickClose: () => void
}
export default function SchemaFlyout({
  schema,
  schemas,
  onChange,
  onDelete,
  onClickClose,
}: SchemaFlyoutProps): React.ReactElement | null {
  const {
    state,
    isEditing,
    fileTree,
    dbOptions,
    selectItem,
    handleKeyDown,
    viewCode,
    viewSchema,
    edit,
    delete_,
    updateDbOptions,
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
  } = useSchemaFlyout({
    schema,
    schemas,
    onChange,
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

  const title = itemName(FileTree.rootItem(fileTree))

  return (
    <Flyout
      contentRef={flyoutContentRef}
      title={title}
      onClickClose={onClickClose}
      controls={
        <SchemaFlyoutControls
          state={state}
          schema={schema}
          isEditing={isEditing}
          fileTree={fileTree}
          dbOptions={dbOptions}
          onChangeDbOptions={updateDbOptions}
          onSelectCode={viewCode}
          onSelectSchema={handleViewSchema}
          onEdit={edit}
          onDelete={delete_}
          onCancel={cancel}
          onSave={save}
        />
      }
    >
      <SchemaFlyoutContent
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
    </Flyout>
  )
}

export function SchemaFlyoutPreloads(): React.ReactElement {
  useGeneratedCode({ schema: emptySchema(), dbOptions: defaultDbOptions })
  return <></>
}
