import { DbOptions, defaultDbOptions } from '@src/core/database'
import { Schema } from '@src/core/schema'
import Flyout from '@src/ui/components/Flyout'
import { useAlert } from '@src/ui/lib/alert'
import React from 'react'
import SchemaFlyoutContent from './SchemaFlyoutContent'
import SchemaFlyoutControls from './SchemaFlyoutControls'
import { useSchemaFlyout } from './useSchemaFlyout'

type SchemaFlyoutProps = {
  schema: Schema
  schemas: Schema[]
  onChange: (schema: Schema) => Promise<Schema>
  onClickClose: () => void
}
export default function SchemaFlyout({
  schema,
  schemas,
  onChange,
  onClickClose,
}: SchemaFlyoutProps): React.ReactElement | null {
  const [dbOptions, setDbOptions] = React.useState<DbOptions>(defaultDbOptions)
  const { success, error } = useAlert()

  const handleChange = React.useCallback(
    (schema: Schema): Promise<Schema> =>
      onChange(schema)
        .then((schema) => {
          success(`Schema ${schema.name} saved.`)
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
    root,
    fileTree,
    selectItem,
    viewCode,
    viewSchema,
    edit,
    updateModel,
    updateSchema,
    addModel,
    addField,
    addAssociation,
    save,
    cancel,
  } = useSchemaFlyout({ schema, schemas, dbOptions, onChange: handleChange, onExit: onClickClose })

  if (!root) return null

  return (
    <Flyout
      title={root.name}
      onClickClose={onClickClose}
      controls={
        <SchemaFlyoutControls
          state={state}
          isEditing={isEditing}
          root={root}
          fileTree={fileTree}
          dbOptions={dbOptions}
          onChangeDbOptions={setDbOptions}
          onSelectCode={viewCode}
          onSelectSchema={viewSchema}
          onEdit={edit}
          onCancel={cancel}
          onSave={save}
        />
      }
    >
      <SchemaFlyoutContent
        state={state}
        schema={schema}
        dbOptions={dbOptions}
        fileTree={fileTree}
        onSelectFileSystemItem={selectItem}
        updateSchema={updateSchema}
        updateModel={updateModel}
        onViewSchema={viewSchema}
        onClickAddModel={addModel}
        onClickAddField={addField}
        onClickAddAssociation={addAssociation}
      />
    </Flyout>
  )
}
