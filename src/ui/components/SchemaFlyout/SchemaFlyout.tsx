import { DbOptions, defaultDbOptions } from '@src/core/database'
import { itemName } from '@src/core/files/fileSystem'
import * as FileTree from '@src/core/files/fileTree'
import { emptySchema, Model, Schema } from '@src/core/schema'
import Flyout from '@src/ui/components/Flyout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import { useAlert } from '@src/ui/lib/alert'
import { scrollToTop } from '@src/utils/dom'
import React from 'react'
import SchemaFlyoutContent from './SchemaFlyoutContent'
import SchemaFlyoutControls from './SchemaFlyoutControls'
import { useSchemaFlyout } from './useSchemaFlyout'

type SchemaFlyoutProps = {
  schema: Schema
  schemas: Schema[]
  onChange: (schema: Schema) => Promise<Schema>
  onDelete: () => Promise<void>
  onClickClose: () => void
}
export default function SchemaFlyout({
  schema,
  schemas,
  onChange,
  onDelete,
  onClickClose,
}: SchemaFlyoutProps): React.ReactElement | null {
  const [dbOptions, setDbOptions] = React.useState<DbOptions>(defaultDbOptions)
  const { success, error } = useAlert()

  const handleChange = React.useCallback(
    (schema: Schema): Promise<Schema> =>
      onChange(schema)
        .then((schema) => {
          success(`Schema ${schema.name} saved.`, { ttl: 2000 })
          return schema
        })
        .catch((e) => {
          console.error(e)
          error(`Error saving schema ${schema.name}`)
          return schema
        }),
    [error, success, onChange],
  )
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
    dbOptions,
    onChange: handleChange,
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
          onChangeDbOptions={setDbOptions}
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
