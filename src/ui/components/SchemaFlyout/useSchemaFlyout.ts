import { DbOptions } from '@src/core/database'
import { DirectoryItem } from '@src/core/files'
import { Model, Schema } from '@src/core/schema'
import {
  emptyModelErrors,
  emptySchemaErrors,
  noModelErrors,
  noSchemaErrors,
  validateModel,
  validateSchema,
} from '@src/core/validation/schema'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import equal from 'fast-deep-equal/es6'
import React from 'react'
import { useFileTree, UseFileTreeResult } from '../FileTree'
import { SchemaFlyoutState, SchemaFlyoutStateType } from './types'

type UseSchemaFlyoutArgs = {
  schema: Schema
  schemas: Schema[]
  dbOptions: DbOptions
  code?: boolean
  onChange: (schema: Schema) => Promise<Schema>
}

type UseSchemaFlyoutResult = {
  state: SchemaFlyoutState
  isEditing: boolean
  root: DirectoryItem | undefined
  fileTree: UseFileTreeResult
  edit: () => void
  viewCode: () => void
  viewSchema: (model?: Model) => void
  updateSchema: (schema: Schema) => void
  updateModel: (model: Model) => void
  save: () => void
  cancel: () => void
}
export function useSchemaFlyout({
  schema,
  schemas,
  dbOptions,
  code = true,
  onChange,
}: UseSchemaFlyoutArgs): UseSchemaFlyoutResult {
  const [state, setState] = React.useState<SchemaFlyoutState>(() =>
    // TODO refactor to abstract empty id
    schema.id === '' || !code
      ? { type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors }
      : { type: SchemaFlyoutStateType.CODE },
  )

  const { root, framework, defaultPath } = useGeneratedCode({ schema, dbOptions })

  const fileTree = useFileTree({
    root,
    cacheKey: schema.id,
    defaultPath,
  })

  const edit = React.useCallback(() => {
    const nextState: SchemaFlyoutState =
      state.type === SchemaFlyoutStateType.VIEW_MODEL
        ? { type: SchemaFlyoutStateType.EDIT_MODEL, model: state.model, errors: emptyModelErrors }
        : { type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors }

    setState(nextState)
  }, [state, schema])

  const viewCode = React.useCallback(() => {
    const path =
      state.type === SchemaFlyoutStateType.VIEW_MODEL &&
      root &&
      framework?.defaultModelFile(state.model, root)

    if (path) fileTree.selectItem(path)

    setState({ type: SchemaFlyoutStateType.CODE })
  }, [state, root, framework, fileTree])

  const viewSchema = React.useCallback(
    (model?: Model) => {
      if (state.type === SchemaFlyoutStateType.CODE) {
        const path = fileTree.activeFile?.path
        const currModel = path && framework?.modelFromPath(path, schema)

        const nextState: SchemaFlyoutState = currModel
          ? { type: SchemaFlyoutStateType.VIEW_MODEL, model: currModel }
          : { type: SchemaFlyoutStateType.VIEW_SCHEMA }

        setState(nextState)
        return
      }

      if (model) {
        setState({ type: SchemaFlyoutStateType.VIEW_MODEL, model })
        return
      }

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA })
    },
    [state, fileTree, framework, schema],
  )

  const updateSchema = React.useCallback(
    (schema: Schema) => {
      if (state.type === SchemaFlyoutStateType.EDIT_SCHEMA) {
        setState({ ...state, schema })
      }
    },
    [state],
  )

  const updateModel = React.useCallback(
    (model: Model) => {
      if (state.type === SchemaFlyoutStateType.EDIT_MODEL) {
        setState({ ...state, model })
      }
    },
    [state],
  )

  const exitEdit = React.useCallback(
    (nextSchema: Schema = schema) => {
      const model =
        state.type === SchemaFlyoutStateType.EDIT_MODEL
          ? nextSchema.models.find((m) => m.id === state.model.id)
          : undefined

      if (model) {
        setState({ type: SchemaFlyoutStateType.VIEW_MODEL, model })
        return
      }

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA })
    },
    [state],
  )

  const save = React.useCallback(async () => {
    if (state.type === SchemaFlyoutStateType.EDIT_SCHEMA) {
      const errors = validateSchema(state.schema, schemas)

      if (noSchemaErrors(errors)) {
        if (!equal(state.schema, schema)) {
          const updatedSchema = await onChange(state.schema)
          exitEdit(updatedSchema)
          return
        }

        exitEdit()
      } else {
        setState({ ...state, errors })
      }
    }

    if (state.type === SchemaFlyoutStateType.EDIT_MODEL) {
      const errors = validateModel(state.model, schema)
      if (noModelErrors(errors)) {
        const newSchema: Schema = {
          ...schema,
          models: schema.models.map((m) => (m.id === state.model.id ? state.model : m)),
        }

        if (!equal(newSchema, schema)) {
          const updatedSchema = await await onChange({
            ...schema,
            models: schema.models.map((m) => (m.id === state.model.id ? state.model : m)),
          })
          exitEdit(updatedSchema)
          return
        }

        exitEdit()
      } else {
        setState({ ...state, errors })
      }
    }
  }, [schema, schemas, state, onChange, exitEdit])

  return {
    state,
    isEditing:
      state.type === SchemaFlyoutStateType.EDIT_MODEL ||
      state.type === SchemaFlyoutStateType.EDIT_SCHEMA,
    root,
    fileTree,
    edit,
    updateModel,
    updateSchema,
    viewCode,
    viewSchema,
    save,
    cancel: exitEdit,
  }
}
