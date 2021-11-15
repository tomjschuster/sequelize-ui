import { DbOptions, defaultDbOptions } from '@src/core/database'
import { Model, Schema } from '@src/core/schema'
import {
  emptySchemaErrors,
  noModelErrors,
  noSchemaErrors,
  validateModel,
  validateSchema,
} from '@src/core/validation/schema'
import { useFileTree } from '@src/ui/components/FileTree'
import Flyout from '@src/ui/components/Flyout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import equal from 'fast-deep-equal/es6'
import React from 'react'
import SchemaFlyoutContent from './SchemaFlyoutContent'
import SchemaFlyoutControls from './SchemaFlyoutControls'
import { SchemaFlyoutMode, SchemaFlyoutModeType } from './types'

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
  const [mode, setMode] = React.useState<SchemaFlyoutMode>(() =>
    // TODO refactor to abstract empty id
    schema.id === ''
      ? { type: SchemaFlyoutModeType.EDIT_SCHEMA, schema, errors: emptySchemaErrors }
      : { type: SchemaFlyoutModeType.CODE },
  )

  const [dbOptions, setDbOptions] = React.useState<DbOptions>(defaultDbOptions)

  const { root, framework, defaultPath } = useGeneratedCode({ schema, dbOptions })

  const fileTree = useFileTree({
    root,
    cacheKey: schema.id,
    defaultPath,
  })

  const handleSave = React.useCallback(async () => {
    switch (mode.type) {
      case SchemaFlyoutModeType.EDIT_SCHEMA: {
        const errors = validateSchema(mode.schema, schemas)

        if (noSchemaErrors(errors)) {
          if (!equal(mode.schema, schema)) await onChange(mode.schema)
          setMode({ type: SchemaFlyoutModeType.VIEW_SCHEMA })
        } else {
          setMode({ ...mode, errors })
        }
        return
      }
      case SchemaFlyoutModeType.EDIT_MODEL: {
        const errors = validateModel(mode.model, schema)
        if (noModelErrors(errors)) {
          const newSchema: Schema = {
            ...schema,
            models: schema.models.map((m) => (m.id === mode.model.id ? mode.model : m)),
          }

          if (!equal(newSchema, schema)) {
            const updated = await onChange({
              ...schema,
              models: schema.models.map((m) => (m.id === mode.model.id ? mode.model : m)),
            })

            const model = updated.models.find((m) => m.id === mode.model.id) as Model

            setMode({ type: SchemaFlyoutModeType.VIEW_MODEL, model })

            return
          }

          setMode({ type: SchemaFlyoutModeType.VIEW_MODEL, model: mode.model })
        } else {
          setMode({ ...mode, errors })
        }
        return
      }
      case SchemaFlyoutModeType.CODE:
      case SchemaFlyoutModeType.VIEW_SCHEMA:
      default:
        return
    }
  }, [schema, schemas, mode, onChange])

  if (!root || !framework) return null

  return (
    <Flyout
      title={root.name}
      onClickClose={onClickClose}
      controls={
        <SchemaFlyoutControls
          mode={mode}
          schema={schema}
          root={root}
          fileTree={fileTree}
          framework={framework}
          dbOptions={dbOptions}
          onChangeDbOptions={setDbOptions}
          onChangeMode={setMode}
          onSave={handleSave}
        />
      }
    >
      <SchemaFlyoutContent
        mode={mode}
        schema={schema}
        dbOptions={dbOptions}
        fileTree={fileTree}
        onChangeMode={setMode}
      />
    </Flyout>
  )
}
