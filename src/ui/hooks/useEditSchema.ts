import { deleteSchema, listSchemas, updateSchema } from '@src/api/schema'
import { emptyModel, Model, Schema } from '@src/core/schema'
import { goTo } from '@src/routing/navigation'
import {
  editModelRoute,
  editSchemaRoute,
  indexRoute,
  isSchemaRoute,
  Route,
  RouteType,
  viewSchemaRoute,
} from '@src/routing/routes'
import useRoute from '@src/ui/hooks/useRoute'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type UseEditSchemaResult = {
  schema: Schema | undefined
  schemas: Schema[] | undefined
  error: string | undefined
  editState: SchemaEditState
  edit: () => void
  addModel: () => Promise<void>
  editModel: (id: Model['id']) => void
  updateModel: (model: Model) => Promise<void>
  deleteModel: (id: Model['id']) => Promise<void>
  cancel: () => void
  update: (schema: Schema) => Promise<Schema>
  destroy: () => Promise<void>
}

export type SchemaEditState =
  | { type: SchemaEditStateType.NoSchema }
  | { type: SchemaEditStateType.NotEditing }
  | { type: SchemaEditStateType.EditingSchema }
  | { type: SchemaEditStateType.EditingModel; id: Model['id'] }

export enum SchemaEditStateType {
  NoSchema = 'NO_SCHEMA',
  NotEditing = 'NOT_EDITING',
  EditingSchema = 'EDITING_SCHEMA',
  EditingModel = 'EDITING_MODEL',
}

export default function useEditSchema(): UseEditSchemaResult {
  const { route, loading } = useRoute()
  const editState = useMemo(() => routeToEditState(route), [route])

  const [schema, setSchema] = useState<Schema | undefined>()
  const [schemas, setSchemas] = useState<Schema[] | undefined>()
  const [error, setError] = useState<string | undefined>()

  const schemaId = useMemo(() => (route && 'schemaId' in route ? route.schemaId : undefined), [
    route,
    schema,
  ])

  useLoadSchema({
    skip: loading || !!error || (!!schema && schema.id === schemaId),
    route,
    schemaId,
    onLoadSchema: setSchema,
    onLoadSchemas: setSchemas,
    onError: setError,
  })

  const edit = useCallback(() => schemaId && goTo(editSchemaRoute(schemaId)), [schemaId, route])

  const update = useCallback(
    async (schema: Schema): Promise<Schema> => {
      const updatedSchema = await updateSchema(schema)
      setSchema(updatedSchema)
      goTo(viewSchemaRoute(schema.id))
      return updatedSchema
    },
    [route],
  )

  const destroy = useCallback(async () => {
    if (!schema) return
    await deleteSchema(schema.id)
    goTo(indexRoute())
  }, [schema, deleteSchema])

  const addModel = useCallback(async () => {
    if (!schema) return
    const {
      models: [model],
    } = await update({ ...schema, models: [emptyModel(), ...schema.models] })

    goTo(editModelRoute(schema.id, model.id))
  }, [schema])

  const updateModel = useCallback(
    async (model: Model) => {
      if (!schema) return
      await update(updateModelInSchema(schema, model))
    },
    [schema],
  )

  const deleteModel = useCallback(
    async (id: Model['id']) => {
      if (!schema) return
      await update(removeModelFromSchema(schema, id))
    },
    [schema],
  )

  const editModel = useCallback(
    (id: Model['id']) => {
      if (!schema) return
      goTo(editModelRoute(schema.id, id))
    },
    [schema],
  )

  const cancel = useCallback(() => schemaId && goTo(viewSchemaRoute(schemaId)), [schemaId])

  return {
    schema,
    schemas,
    error,
    editState,
    edit,
    update,
    destroy,
    addModel,
    editModel,
    updateModel,
    deleteModel,
    cancel,
  }
}

type UseLoadSchemaArgs = {
  skip: boolean
  route: Route | undefined
  schemaId: string | undefined
  onLoadSchema: (schema: Schema) => void
  onLoadSchemas: (schemas: Schema[]) => void
  onError: (error: string) => void
}
function useLoadSchema({
  skip,
  route,
  schemaId,
  onLoadSchema,
  onLoadSchemas,
  onError,
}: UseLoadSchemaArgs) {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (skip || loading || !route) {
      return
    }

    if (!isSchemaRoute(route)) {
      goTo(indexRoute())
      return
    }

    setLoading(true)

    listSchemas()
      .then((schemas) => {
        const schema = schemas.find((s) => s.id === schemaId)
        if (!schemaId && schemas[0]) {
          return goTo(viewSchemaRoute(schemas[0].id))
        }
        if (!schema) {
          return goTo(indexRoute())
        }
        onLoadSchemas(schemas)
        onLoadSchema(schema)
        setLoading(false)
      })
      .catch(() => {
        onError('Sorry, something went wrong.')
        setLoading(false)
      })
  }, [skip, loading, route, schemaId])
}

function routeToEditState(route?: Route): SchemaEditState {
  switch (route?.type) {
    case RouteType.EditSchema:
      return { type: SchemaEditStateType.EditingSchema }
    case RouteType.EditModel:
      return { type: SchemaEditStateType.EditingModel, id: route.modelId }
    case RouteType.ViewSchema:
      return { type: SchemaEditStateType.NotEditing }
    case RouteType.NoSchema:
    default:
      return { type: SchemaEditStateType.NoSchema }
  }
}

function updateModelInSchema(schema: Schema, model: Model): Schema {
  return {
    ...schema,
    models: schema.models.map((m) => (m.id === model.id ? model : m)),
  }
}

function removeModelFromSchema(schema: Schema, modelId: Model['id']): Schema {
  return {
    ...schema,
    models: schema.models
      // Remove model
      .filter((m) => m.id !== modelId)
      // Remove associations related to model
      .map((m) => ({
        ...m,
        associations: m.associations.filter(
          (a) => a.sourceModelId !== modelId && a.targetModelId !== modelId,
        ),
      })),
  }
}
