import { DbOptions } from '@src/core/database'
import { DirectoryItem, FileTreeState } from '@src/core/files'
import { isNewSchema, Model, Schema } from '@src/core/schema'
import {
  emptyModelErrors,
  emptySchemaErrors,
  hasSchemaErrors,
  noModelErrors,
  validateModel,
  validateSchema,
} from '@src/core/validation/schema'
import { isDemoSchema } from '@src/data/schemas'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import equal from 'fast-deep-equal/es6'
import React from 'react'
import { useFileTree } from '../FileTree'
import { SchemaFlyoutState, SchemaFlyoutStateType } from './types'

type UseSchemaFlyoutArgs = {
  schema: Schema
  schemas: Schema[]
  dbOptions: DbOptions
  code?: boolean
  onChange: (schema: Schema) => Promise<Schema>
  onExit: () => void
}

type UseSchemaFlyoutResult = {
  state: SchemaFlyoutState
  isEditing: boolean
  root: DirectoryItem | undefined
  fileTree: FileTreeState
  selectItem: (path: string) => void
  edit: () => void
  viewCode: () => void
  viewSchema: (model?: Model) => void
  updateSchema: (schema: Schema) => void
  updateModel: (model: Model) => void
  addModel: () => void
  addField: () => void
  addAssociation: () => void
  save: () => void
  cancel: () => void
}
export function useSchemaFlyout({
  schema,
  schemas,
  dbOptions,
  code = true,
  onChange,
  onExit,
}: UseSchemaFlyoutArgs): UseSchemaFlyoutResult {
  const [state, setState] = React.useState<SchemaFlyoutState>(() =>
    isNewSchema(schema) || !code
      ? { type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors }
      : { type: SchemaFlyoutStateType.CODE },
  )

  const { root, framework, defaultPath } = useGeneratedCode({ schema, dbOptions })
  const { fileTree, selectItem } = useFileTree({ root, key: schema.id, defaultPath })

  const edit = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.CODE) {
      const path = fileTree.activeFile?.path
      const model = path && framework?.modelFromPath(path, schema)
      if (model) {
        setState({ type: SchemaFlyoutStateType.EDIT_MODEL, model, errors: emptyModelErrors })
      } else {
        setState({ type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors })
      }
      return
    }

    if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
      })
      return
    }

    setState({ type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors })
  }, [state, schema, fileTree, framework])

  const viewCode = React.useCallback(() => {
    const path =
      state.type === SchemaFlyoutStateType.VIEW_MODEL &&
      root &&
      framework?.defaultModelFile(state.model, root)

    if (path) selectItem(path)

    setState({ type: SchemaFlyoutStateType.CODE })
  }, [state, root, framework, selectItem])

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

  const addModel = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.VIEW_SCHEMA) {
      setState({
        type: SchemaFlyoutStateType.EDIT_SCHEMA,
        schema,
        errors: emptySchemaErrors,
        newModel: true,
      })
    }
  }, [schema, state])

  const addField = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
        newField: true,
      })
    }
  }, [state])

  const addAssociation = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
        newAssociation: true,
      })
    }
  }, [state])

  const exitEdit = React.useCallback(
    (nextSchema: Schema) => {
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

      if (hasSchemaErrors(errors)) {
        setState({ ...state, errors })
        return
      }

      if (isDemoSchema(state.schema) || !equal(state.schema, schema)) {
        const updatedSchema = await onChange(state.schema)
        exitEdit(updatedSchema)
        return
      }

      if (isNewSchema(state.schema)) {
        onExit()
        return
      }

      exitEdit(schema)
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

        exitEdit(schema)
      } else {
        setState({ ...state, errors })
      }
    }
  }, [schema, schemas, state, onChange, exitEdit, onExit])

  const cancel = React.useCallback(() => {
    if (isNewSchema(schema)) {
      onExit()
      return
    }

    if (isDemoSchema(schema)) {
      viewCode()
      return
    }

    exitEdit(schema)
  }, [schema, exitEdit, onExit, viewCode])

  return {
    state,
    isEditing:
      state.type === SchemaFlyoutStateType.EDIT_MODEL ||
      state.type === SchemaFlyoutStateType.EDIT_SCHEMA,
    root,
    fileTree,
    selectItem,
    edit,
    updateModel,
    updateSchema,
    addModel,
    addField,
    addAssociation,
    viewCode,
    viewSchema,
    save,
    cancel,
  }
}
