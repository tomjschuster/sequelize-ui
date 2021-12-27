import { DbOptions, defaultDbOptions } from '@src/core/database'
import { activeFilePath, FileTree } from '@src/core/files/fileTree'
import {
  Association,
  displayAssociation,
  Field,
  isNewSchema,
  Model,
  Schema,
} from '@src/core/schema'
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
import { useAlert } from '@src/ui/lib/alert'
import equal from 'fast-deep-equal/es6'
import React from 'react'
import { useFileTree } from '../FileTreeView'
import { InitialEditModelStateType, SchemaFlyoutState, SchemaFlyoutStateType } from './types'

type UseSchemaFlyoutArgs = {
  schema: Schema
  schemas: Schema[]
  code?: boolean
  onChange: (schema: Schema) => Promise<Schema>
  onDelete: () => Promise<void>
  onExit: () => void
}

type UseSchemaFlyoutResult = {
  state: SchemaFlyoutState
  isEditing: boolean
  fileTree: FileTree
  dbOptions: DbOptions
  selectItem: (path: string) => void
  handleKeyDown: (evt: React.KeyboardEvent) => void
  edit: () => void
  delete_: () => void
  updateDbOptions: (dbOptions: DbOptions) => void
  viewCode: () => void
  viewSchema: (model?: Model) => void
  updateSchema: (schema: Schema) => void
  updateModel: (model: Model) => void
  addModel: () => void
  editModel: (field: Model) => void
  deleteModel: (field: Model) => void
  addField: () => void
  editField: (field: Field) => void
  deleteField: (field: Field) => void
  addAssociation: () => void
  editAssociation: (association: Association) => void
  deleteAssociation: (association: Association) => void
  save: () => void
  cancel: () => void
}
export function useSchemaFlyout({
  schema,
  schemas,
  code = true,
  onChange,
  onDelete,
  onExit,
}: UseSchemaFlyoutArgs): UseSchemaFlyoutResult {
  const [state, setState] = React.useState<SchemaFlyoutState>(() =>
    isNewSchema(schema) || !code
      ? { type: SchemaFlyoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors }
      : { type: SchemaFlyoutStateType.CODE },
  )

  const [dbOptions, setDbOptions] = React.useState<DbOptions>(defaultDbOptions)
  const { success, error } = useAlert()

  const change = React.useCallback(
    (schema: Schema, message: string): Promise<Schema> =>
      onChange(schema)
        .then((schema) => {
          success(message || `Schema "${schema.name}" saved.`, { ttl: 6000 })
          return schema
        })
        .catch((e) => {
          console.error(e)
          error(`Error saving schema "${schema.name}"`)
          return schema
        }),
    [error, success, onChange],
  )

  const { root, framework, defaultPath } = useGeneratedCode({ schema, dbOptions })
  const { fileTree, selectItem, handleKeyDown } = useFileTree({ root, key: schema.id, defaultPath })

  const edit = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.CODE) {
      const path = activeFilePath(fileTree)
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
        const path = activeFilePath(fileTree)
        const currModel = path && framework?.modelFromPath(path, schema)

        const nextState: SchemaFlyoutState = currModel
          ? { type: SchemaFlyoutStateType.VIEW_MODEL, model: currModel }
          : { type: SchemaFlyoutStateType.VIEW_SCHEMA, schema }

        setState(nextState)
        return
      }

      if (model) {
        setState({ type: SchemaFlyoutStateType.VIEW_MODEL, model })
        return
      }

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA, schema })
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

  const editModel = React.useCallback((model: Model) => {
    setState({
      type: SchemaFlyoutStateType.EDIT_MODEL,
      model,
      errors: emptyModelErrors,
    })
  }, [])

  const deleteModel = React.useCallback(
    async (model: Model) => {
      const updatedSchema = await change(
        {
          ...schema,
          models: schema.models.filter((m) => m.id !== model.id),
        },
        `Model "${model.name}" deleted.`,
      )

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA, schema: updatedSchema })
      return
    },
    [change, schema],
  )

  const addField = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
        initialState: { type: InitialEditModelStateType.NEW_FIELD },
      })
    }
  }, [state])

  const addAssociation = React.useCallback(() => {
    if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaFlyoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
        initialState: { type: InitialEditModelStateType.NEW_ASSOCIATION },
      })
    }
  }, [state])

  const editAssociation = React.useCallback(
    async (association: Association) => {
      const model = schema.models.find((m) => m.id === association.sourceModelId)
      if (model) {
        setState({
          type: SchemaFlyoutStateType.EDIT_MODEL,
          model,
          initialState: { type: InitialEditModelStateType.EDIT_ASSOCIATION, association },
          errors: emptyModelErrors,
        })
      }
    },
    [schema.models],
  )

  const deleteAssociation = React.useCallback(
    async (association: Association) => {
      if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
        const model: Model = {
          ...state.model,
          associations: state.model.associations.filter((a) => a.id !== association.id),
        }

        const targetModel = schema.models.find((m) => m.id === association.targetModelId)

        const updatedSchema = await change(
          {
            ...schema,
            models: schema.models.map((m) => (m.id === state.model.id ? model : m)),
          },
          `Association "${displayAssociation(association)}${
            targetModel ? ` ${targetModel.name}` : ''
          }" deleted.`,
        )

        const updatedModel = updatedSchema.models.find((m) => m.id === model.id)

        if (updatedModel) {
          setState({
            type: SchemaFlyoutStateType.VIEW_MODEL,
            model: updatedModel,
          })
        }

        return
      }
    },
    [schema, state, change],
  )

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

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA, schema: nextSchema })
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
        const updatedSchema = await change(state.schema, `Schema "${state.schema.name}" saved.`)
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
          const updatedSchema = await await change(
            {
              ...schema,
              models: schema.models.map((m) => (m.id === state.model.id ? state.model : m)),
            },
            `Model "${state.model.name}" saved`,
          )
          exitEdit(updatedSchema)
          return
        }

        exitEdit(schema)
      } else {
        setState({ ...state, errors })
      }
    }
  }, [schema, schemas, state, change, exitEdit, onExit])

  const deleteField = React.useCallback(
    async (field: Field) => {
      if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
        const model: Model = {
          ...state.model,
          fields: state.model.fields.filter((f) => f.id !== field.id),
        }

        const updatedSchema = await change(
          {
            ...schema,
            models: schema.models.map((m) => (m.id === state.model.id ? model : m)),
          },
          `Field "${field.name}" deleted.`,
        )

        const updatedModel = updatedSchema.models.find((m) => m.id === model.id)

        if (updatedModel) {
          setState({
            type: SchemaFlyoutStateType.VIEW_MODEL,
            model: updatedModel,
          })
        }

        return
      }
    },
    [schema, state, change],
  )

  const editField = React.useCallback(
    async (field: Field) => {
      const model = schema.models.find((m) => m.fields.some((f) => f.id === field.id))
      if (model) {
        setState({
          type: SchemaFlyoutStateType.EDIT_MODEL,
          model,
          initialState: { type: InitialEditModelStateType.EDIT_FIELD, field },
          errors: emptyModelErrors,
        })
      }
    },
    [schema.models],
  )

  const delete_ = React.useCallback(async () => {
    if (
      state.type === SchemaFlyoutStateType.VIEW_SCHEMA ||
      state.type === SchemaFlyoutStateType.EDIT_SCHEMA
    ) {
      return await onDelete()
        .then(() => {
          success(`Schema ${schema.name} deleted.`)
          onExit()
        })
        .catch(() => {
          error(`Failed to delete schema ${schema.name}.`)
        })
    }

    if (
      state.type === SchemaFlyoutStateType.VIEW_MODEL ||
      state.type === SchemaFlyoutStateType.EDIT_MODEL
    ) {
      const updatedSchema = await change(
        {
          ...schema,
          models: schema.models.filter((m) => m.id !== state.model.id),
        },
        `Model "${state.model.name}" deleted.`,
      )

      setState({ type: SchemaFlyoutStateType.VIEW_SCHEMA, schema: updatedSchema })
      return
    }
  }, [schema, state, change, onExit, onDelete])

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
    fileTree,
    dbOptions,
    selectItem,
    handleKeyDown,
    edit,
    delete_,
    updateDbOptions: setDbOptions,
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
    viewCode,
    viewSchema,
    save,
    cancel,
  }
}
