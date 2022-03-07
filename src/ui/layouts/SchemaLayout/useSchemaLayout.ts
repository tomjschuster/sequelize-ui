import { SchemaMeta } from '@src/api/meta'
import { DbOptions } from '@src/core/database'
import { activeFilePath, FileTree } from '@src/core/files/fileTree'
import { Framework } from '@src/core/framework'
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
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import { useAlert } from '@src/ui/lib/alert'
import equal from 'fast-deep-equal/es6'
import React from 'react'
import { useFileTree } from '../../components/FileTreeView'
import { InitialEditModelStateType, SchemaLayoutState, SchemaLayoutStateType } from './types'

type UseSchemaLayoutArgs = {
  schema: Schema
  dbOptions: DbOptions
  meta?: SchemaMeta
  initialFramework?: Framework
  initiallyEditing?: boolean
  onChangeSchema: (schema: Schema) => Promise<Schema>
  onChangeDbOptions: (dbOptions: DbOptions) => Promise<DbOptions>
  onDelete?: () => Promise<void>
  onExit: () => void
}

type UseSchemaLayoutResult = {
  state: SchemaLayoutState
  isEditing: boolean
  fileTree: FileTree
  selectItem: (path: string) => void
  handleKeyDown: (evt: React.KeyboardEvent) => void
  edit: () => void
  delete_: () => void
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
  back: () => void
}
export function useSchemaLayout({
  schema,
  dbOptions,
  meta,
  initialFramework,
  initiallyEditing = false,
  onChangeSchema,
  onDelete,
  onExit,
}: UseSchemaLayoutArgs): UseSchemaLayoutResult {
  const [state, setState] = React.useState<SchemaLayoutState>(() =>
    initiallyEditing
      ? { type: SchemaLayoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors }
      : { type: SchemaLayoutStateType.CODE },
  )

  const { success, error } = useAlert()

  const change = React.useCallback(
    (schema: Schema, message: string | ((schema: Schema) => string)): Promise<Schema> =>
      onChangeSchema(schema)
        .then((schema) => {
          const messageString = typeof message === 'string' ? message : message(schema)
          success(messageString, { ttl: 4000 })
          return schema
        })
        .catch((e) => {
          console.error(e)
          error(`Error saving schema "${schema.name}"`)
          return schema
        }),
    [error, success, onChangeSchema],
  )

  const { root, framework, defaultPath } = useGeneratedCode({
    schema,
    meta,
    dbOptions,
    initialFramework,
  })
  const { fileTree, selectItem, handleKeyDown } = useFileTree({ root, key: schema.id, defaultPath })

  const edit = React.useCallback(() => {
    if (state.type === SchemaLayoutStateType.CODE) {
      const path = activeFilePath(fileTree)
      const model = path && framework?.modelFromPath(path, schema)

      if (model) {
        setState({ type: SchemaLayoutStateType.EDIT_MODEL, model, errors: emptyModelErrors })
      } else {
        setState({ type: SchemaLayoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors })
      }
      return
    }

    if (state.type === SchemaLayoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaLayoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
      })
      return
    }

    setState({ type: SchemaLayoutStateType.EDIT_SCHEMA, schema, errors: emptySchemaErrors })
  }, [state, schema, fileTree, framework])

  const viewCode = React.useCallback(() => {
    const path =
      state.type === SchemaLayoutStateType.VIEW_MODEL &&
      root &&
      framework?.defaultModelFile(state.model, root)

    if (path) selectItem(path)

    setState({ type: SchemaLayoutStateType.CODE })
  }, [state, root, framework, selectItem])

  const viewSchema = React.useCallback(
    (model?: Model) => {
      if (state.type === SchemaLayoutStateType.CODE) {
        const path = activeFilePath(fileTree)
        const currModel = path && framework?.modelFromPath(path, schema)

        const nextState: SchemaLayoutState = currModel
          ? { type: SchemaLayoutStateType.VIEW_MODEL, model: currModel }
          : { type: SchemaLayoutStateType.VIEW_SCHEMA, schema }

        setState(nextState)
        return
      }

      if (model) {
        setState({ type: SchemaLayoutStateType.VIEW_MODEL, model })
        return
      }

      setState({ type: SchemaLayoutStateType.VIEW_SCHEMA, schema })
    },
    [state, fileTree, framework, schema],
  )

  const updateSchema = React.useCallback(
    (schema: Schema) => {
      if (state.type === SchemaLayoutStateType.EDIT_SCHEMA) {
        setState({ ...state, schema })
      }
    },
    [state],
  )

  const updateModel = React.useCallback(
    (model: Model) => {
      if (state.type === SchemaLayoutStateType.EDIT_MODEL) {
        setState({ ...state, model })
      }
    },
    [state],
  )

  const addModel = React.useCallback(() => {
    if (state.type === SchemaLayoutStateType.VIEW_SCHEMA) {
      setState({
        type: SchemaLayoutStateType.EDIT_SCHEMA,
        schema,
        errors: emptySchemaErrors,
        newModel: true,
      })
    }
  }, [schema, state])

  const editModel = React.useCallback((model: Model) => {
    setState({
      type: SchemaLayoutStateType.EDIT_MODEL,
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

      setState({ type: SchemaLayoutStateType.VIEW_SCHEMA, schema: updatedSchema })
      return
    },
    [change, schema],
  )

  const addField = React.useCallback(() => {
    if (state.type === SchemaLayoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaLayoutStateType.EDIT_MODEL,
        model: state.model,
        errors: emptyModelErrors,
        initialState: { type: InitialEditModelStateType.NEW_FIELD },
      })
    }
  }, [state])

  const addAssociation = React.useCallback(() => {
    if (state.type === SchemaLayoutStateType.VIEW_MODEL) {
      setState({
        type: SchemaLayoutStateType.EDIT_MODEL,
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
          type: SchemaLayoutStateType.EDIT_MODEL,
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
      if (state.type === SchemaLayoutStateType.VIEW_MODEL) {
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
            type: SchemaLayoutStateType.VIEW_MODEL,
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
        state.type === SchemaLayoutStateType.EDIT_MODEL
          ? nextSchema.models.find((m) => m.id === state.model.id)
          : undefined

      if (model) {
        setState({ type: SchemaLayoutStateType.VIEW_MODEL, model })
        return
      }

      setState({ type: SchemaLayoutStateType.VIEW_SCHEMA, schema: nextSchema })
    },
    [state],
  )

  const save = React.useCallback(async () => {
    if (state.type === SchemaLayoutStateType.EDIT_SCHEMA) {
      const errors = validateSchema(state.schema)

      if (hasSchemaErrors(errors)) {
        setState({ ...state, errors })
        return
      }

      if (meta?.isExample || !equal(state.schema, schema)) {
        const updatedSchema = await change(state.schema, (s) => `Schema "${s.name}" saved.`)
        exitEdit(updatedSchema)
        return
      }

      if (isNewSchema(state.schema)) {
        onExit()
        return
      }

      exitEdit(schema)
    }

    if (state.type === SchemaLayoutStateType.EDIT_MODEL) {
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
  }, [schema, state, meta, change, exitEdit, onExit])

  const deleteField = React.useCallback(
    async (field: Field) => {
      if (state.type === SchemaLayoutStateType.VIEW_MODEL) {
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
            type: SchemaLayoutStateType.VIEW_MODEL,
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
          type: SchemaLayoutStateType.EDIT_MODEL,
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
      onDelete &&
      (state.type === SchemaLayoutStateType.VIEW_SCHEMA ||
        state.type === SchemaLayoutStateType.EDIT_SCHEMA)
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
      state.type === SchemaLayoutStateType.VIEW_MODEL ||
      state.type === SchemaLayoutStateType.EDIT_MODEL
    ) {
      const updatedSchema = await change(
        {
          ...schema,
          models: schema.models.filter((m) => m.id !== state.model.id),
        },
        `Model "${state.model.name}" deleted.`,
      )

      setState({ type: SchemaLayoutStateType.VIEW_SCHEMA, schema: updatedSchema })
      return
    }
  }, [onDelete, state, schema, success, onExit, error, change])

  const cancel = React.useCallback(() => {
    if (isNewSchema(schema)) {
      onExit()
      return
    }

    if (meta?.isExample) {
      viewCode()
      return
    }

    exitEdit(schema)
  }, [schema, meta, exitEdit, onExit, viewCode])

  const back = React.useCallback(() => {
    if (state.type === SchemaLayoutStateType.VIEW_MODEL) {
      setState({ type: SchemaLayoutStateType.VIEW_SCHEMA, schema })
      return
    }

    onExit()
  }, [schema, state, onExit])

  return {
    state,
    isEditing:
      state.type === SchemaLayoutStateType.EDIT_MODEL ||
      state.type === SchemaLayoutStateType.EDIT_SCHEMA,
    fileTree,
    selectItem,
    handleKeyDown,
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
    viewCode,
    viewSchema,
    save,
    cancel,
    back,
  }
}
