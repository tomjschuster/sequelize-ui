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
import Flyout, { ControlsAction } from '@src/ui/components/Flyout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import { classnames } from '@src/ui/styles/classnames'
import equal from 'fast-deep-equal/es6'
import React, { useCallback, useState } from 'react'
import CodeExplorer from '../CodeExplorer/CodeExplorer'
import Button from '../form/Button'
import Toggle from '../form/Toggle'
import CloseIcon from '../icons/Close'
import CodeIcon from '../icons/Code'
import CubeIcon from '../icons/Cube'
import FloppyDiscIcon from '../icons/FloppyDisc'
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

  const [dbOptions, setDbOptions] = useState<DbOptions>(defaultDbOptions)

  const { root, framework, defaultPath } = useGeneratedCode({ schema, dbOptions })

  const fileTree = useFileTree({
    root,
    cacheKey: schema.id,
    defaultPath,
  })

  const handleViewSchema = useCallback(() => {
    const path = fileTree.activeFile?.path
    const model = path && framework?.modelFromPath && framework.modelFromPath(path, schema)
    if (model) {
      setMode({ type: ModeType.VIEW_MODEL, model })
    } else {
      setMode({ type: ModeType.VIEW_SCHEMA })
    }
  }, [fileTree, framework, schema])

  const handleViewCode = useCallback(() => {
    const path =
      mode.type === ModeType.VIEW_MODEL &&
      root &&
      framework &&
      framework.defaultModelFile &&
      framework.defaultModelFile(mode.model, root)

    if (path) fileTree.selectItem(path)

    setMode({ type: ModeType.CODE })
  }, [mode, root, framework, fileTree])

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

  if (!root) return null

  return (
    <Flyout
      title={root.name}
      onClickClose={onClickClose}
      controls={
        <div className={classnames('flex', 'p-2', 'items-center', 'justify-between', 'w-full')}>
          <div className={classnames('flex')}>
            {mode.type !== ModeType.EDIT_MODEL && mode.type !== ModeType.EDIT_SCHEMA && (
              <Toggle
                value={mode.type === ModeType.CODE}
                options={{ code: true, schema: false }}
                display={(v) =>
                  v ? (
                    <span className={classnames('flex', 'items-center', 'justify-center', 'w-16')}>
                      <CodeIcon />
                      <span className={classnames('ml-1')}>Code</span>
                    </span>
                  ) : (
                    <span className={classnames('flex', 'items-center', 'justify-center', 'w-16')}>
                      <CubeIcon />
                      <span className={classnames('ml-1')}>Schema</span>
                    </span>
                  )
                }
                onChange={(v) => (v ? handleViewCode() : handleViewSchema())}
              />
            )}
          </div>
          <div className={classnames('flex')}>
            {mode.type === ModeType.CODE ? (
              <CodeViewerControls
                root={root}
                activeFile={fileTree.activeFile}
                dbOptions={dbOptions}
                onClickEdit={() => setMode({ type: ModeType.VIEW_SCHEMA })}
                onChangeDbOptions={setDbOptions}
              />
            ) : mode.type === ModeType.VIEW_SCHEMA ? (
              <ControlsAction
                onClick={() =>
                  setMode({ type: ModeType.EDIT_SCHEMA, schema, errors: emptySchemaErrors })
                }
              >
                <PencilIcon title="edit schema" />
              </ControlsAction>
            ) : mode.type === ModeType.VIEW_MODEL ? (
              <ControlsAction
                onClick={() =>
                  setMode({
                    type: ModeType.EDIT_MODEL,
                    model: mode.model,
                    errors: emptyModelErrors,
                  })
                }
              >
                <PencilIcon title="edit schema" />
              </ControlsAction>
            ) : (
              <>
                <Button
                  className={classnames('hover:bg-blue-100', 'w-20', 'text-sm')}
                  onClick={() =>
                    mode.type === ModeType.EDIT_MODEL
                      ? setMode({ type: ModeType.VIEW_MODEL, model: mode.model })
                      : setMode({ type: ModeType.VIEW_SCHEMA })
                  }
                >
                  <CloseIcon size={4} />
                  <span className={classnames('ml-1')}>Cancel</span>
                </Button>
                <Button
                  className={classnames(
                    'text-white',
                    'bg-blue-600',
                    'hover:bg-blue-400',
                    'w-20',
                    'text-sm',
                    'ml-2',
                  )}
                  onClick={handleSave}
                >
                  <FloppyDiscIcon />
                  <span className={classnames('ml-1')}>Save</span>
                </Button>
              </>
            )}
          </div>
        </div>
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
