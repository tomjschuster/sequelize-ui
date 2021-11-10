import { DbOptions, defaultDbOptions } from '@src/core/database'
import { Model, Schema } from '@src/core/schema'
import {
  emptyModelErrors,
  emptySchemaErrors,
  ModelErrors,
  noModelErrors,
  noSchemaErrors,
  SchemaErrors,
  validateModel,
  validateSchema,
} from '@src/core/validation/schema'
import { useFileTree } from '@src/ui/components/FileTree'
import Flyout, { ControlsAction, ControlsBar } from '@src/ui/components/Flyout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import { classnames } from '@src/ui/styles/classnames'
import equal from 'fast-deep-equal/es6'
import React, { useCallback, useState } from 'react'
import CodeExplorer from '../CodeExplorer/CodeExplorer'
import CodeIcon from '../icons/Code'
import PencilIcon from '../icons/Pencil'
import ModelForm from '../ModelForm'
import ModelView from '../ModelView'
import SchemaForm from '../SchemaForm'
import SchemaView from '../SchemaView'
import CodeViewerControls from './CodeViewerControls'

const enum ModeType {
  CODE = 'code',
  VIEW_SCHEMA = 'view-schema',
  EDIT_SCHEMA = 'edit-schema',
  VIEW_MODEL = 'view-model',
  EDIT_MODEL = 'edit-model',
}

type Mode =
  | { type: ModeType.CODE }
  | { type: ModeType.VIEW_SCHEMA }
  | { type: ModeType.EDIT_SCHEMA; schema: Schema; errors: SchemaErrors }
  | { type: ModeType.VIEW_MODEL; model: Model }
  | { type: ModeType.EDIT_MODEL; model: Model; errors: ModelErrors }

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
  const [mode, setMode] = useState<Mode>(() =>
    // TODO refactor to abstract empty id
    schema.id === ''
      ? { type: ModeType.EDIT_SCHEMA, schema, errors: emptySchemaErrors }
      : { type: ModeType.CODE },
  )

  const handleSave = useCallback(async () => {
    switch (mode.type) {
      case ModeType.EDIT_SCHEMA: {
        const errors = validateSchema(mode.schema, schemas)

        if (noSchemaErrors(errors)) {
          console.log('handleSave')
          if (!equal(mode.schema, schema)) await onChange(mode.schema)
          setMode({ type: ModeType.VIEW_SCHEMA })
        } else {
          setMode({ ...mode, errors })
        }
        return
      }
      case ModeType.EDIT_MODEL: {
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

            setMode({ type: ModeType.VIEW_MODEL, model })
            return
          }

          setMode({ type: ModeType.VIEW_MODEL, model: mode.model })
        } else {
          setMode({ ...mode, errors })
        }
        return
      }
      case ModeType.CODE:
      case ModeType.VIEW_SCHEMA:
      default:
        return
    }
  }, [schema, schemas, mode, onChange])

  const [dbOptions, setDbOptions] = useState<DbOptions>(defaultDbOptions)

  const { root, defaultPath } = useGeneratedCode({ schema, dbOptions })

  const fileTree = useFileTree({
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
        mode.type === ModeType.CODE ? (
          <CodeViewerControls
            root={root}
            activeFile={fileTree.activeFile}
            dbOptions={dbOptions}
            onClickEdit={() => setMode({ type: ModeType.VIEW_SCHEMA })}
            onChangeDbOptions={setDbOptions}
          />
        ) : mode.type === ModeType.VIEW_SCHEMA ? (
          <ControlsBar>
            <ControlsAction onClick={() => setMode({ type: ModeType.CODE })}>
              <CodeIcon title="view code" />
            </ControlsAction>
            <ControlsAction
              onClick={() =>
                setMode({ type: ModeType.EDIT_SCHEMA, schema, errors: emptySchemaErrors })
              }
            >
              <PencilIcon title="edit schema" />
            </ControlsAction>
          </ControlsBar>
        ) : mode.type === ModeType.VIEW_MODEL ? (
          <ControlsBar>
            <ControlsAction onClick={() => setMode({ type: ModeType.CODE })}>
              <CodeIcon title="view code" />
            </ControlsAction>
            <ControlsAction
              onClick={() =>
                setMode({ type: ModeType.EDIT_MODEL, model: mode.model, errors: emptyModelErrors })
              }
            >
              <PencilIcon title="edit schema" />
            </ControlsAction>
          </ControlsBar>
        ) : (
          <ControlsBar>
            <button
              className={classnames(
                'px-4',
                'rounded',
                'border',
                'border-blue-600',
                'hover:bg-blue-100',
              )}
              onClick={() =>
                mode.type === ModeType.EDIT_MODEL
                  ? setMode({ type: ModeType.VIEW_MODEL, model: mode.model })
                  : setMode({ type: ModeType.VIEW_SCHEMA })
              }
            >
              Cancel
            </button>
            <button
              className={classnames(
                'ml-4',
                'px-4',
                'rounded',
                'text-white',
                'border',
                'border-blue-600',
                'bg-blue-500',
                'hover:bg-blue-400',
              )}
              onClick={handleSave}
            >
              Save
            </button>
          </ControlsBar>
        )
      }
    >
      {mode.type === ModeType.CODE && (
        <CodeExplorer schema={schema} dbOptions={dbOptions} fileTree={fileTree} />
      )}
      {mode.type === ModeType.EDIT_SCHEMA && (
        <SchemaForm
          schema={mode.schema}
          errors={mode.errors}
          onChange={(schema) => setMode({ ...mode, schema })}
        />
      )}
      {mode.type === ModeType.VIEW_SCHEMA && (
        <SchemaView
          schema={schema}
          onClickModel={(model) => setMode({ type: ModeType.VIEW_MODEL, model })}
        />
      )}
      {mode.type === ModeType.EDIT_MODEL && (
        <ModelForm
          model={mode.model}
          schema={schema}
          errors={mode.errors}
          onChange={(model) => setMode({ ...mode, model })}
        />
      )}
      {mode.type === ModeType.VIEW_MODEL && (
        <ModelView
          model={mode.model}
          schema={schema}
          onClickSchema={() => setMode({ type: ModeType.VIEW_SCHEMA })}
          onClickModel={(model) => setMode({ type: ModeType.VIEW_MODEL, model })}
        />
      )}
    </Flyout>
  )
}
