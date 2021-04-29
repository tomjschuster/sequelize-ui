import * as SchemaApi from '@src/api/schema'
import { Schema } from '@src/core/schema'
import blogSchema from '@src/data/schemas/blog'
import sakilaSchema from '@src/data/schemas/sakila'
import { goTo } from '@src/routing/navigation'
import {
  editModelRoute,
  editSchemaRoute,
  indexRoute,
  noSchemaRoute,
  notFoundRoute,
  viewSchemaRoute,
} from '@src/routing/routes'
import useRoute from '@src/ui/hooks/useRoute'
import { act, renderHook } from '@testing-library/react-hooks'
import useEditSchema, { SchemaEditStateType, UseEditSchemaResult } from '../useEditSchema'

jest.mock('@src/ui/hooks/useRoute', () => ({
  __esModule: true,
  default: jest.fn(() => ({ route: undefined, loading: false })),
}))

jest.mock('@src/routing/navigation', () => ({
  goTo: jest.fn(),
}))

describe('useEditSchema', () => {
  let schema: Schema
  let schemas: Schema[]

  beforeEach(async () => {
    localStorage.clear()
    jest.clearAllMocks()
    schema = await SchemaApi.createSchema(blogSchema)
    const schema2 = await SchemaApi.createSchema(sakilaSchema)
    schemas = [schema, schema2]
  })

  it('returns an empty state', () => {
    const { result } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    expect(result.current.schema).toBeUndefined()
    expect(result.current.schemas).toBeUndefined()
    expect(result.current.error).toBeUndefined()
    expect(result.current.editState).toEqual({ type: SchemaEditStateType.NoSchema })
    // Fixes update to TestComponent warning
    // return waitForNextUpdate()
  })

  it('navigates to the first schema when no schema id', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({ route: noSchemaRoute(), loading: false })

    const { waitFor } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    await waitFor(() => true, { timeout: 0 })
    expect(goTo).toHaveBeenCalledWith(viewSchemaRoute(schema.id))
  })

  it('navigates to index when not a schema route', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({ route: notFoundRoute(), loading: false })

    const { waitFor } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    await waitFor(() => true, { timeout: 0 })
    expect(goTo).toHaveBeenCalledWith(indexRoute())
  })

  it('navigates home when schema not found', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({ route: viewSchemaRoute('foo'), loading: false })
    const { waitFor } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    await waitFor(() => true, { timeout: 0 })
    expect(goTo).toHaveBeenCalledWith(indexRoute())
  })

  it('loads the schema when found', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    await waitForValueToChange(() => result.current.schema, { timeout: 0 })
    expect(result.current.schema).toEqual(schema)
  })

  it('loads all schemas when found', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    await waitForValueToChange(() => result.current.schemas, { timeout: 0 })
    expect(result.current.schemas).toEqual(schemas)
  })

  it('returns an error when fetching fails', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })
    jest.spyOn(SchemaApi, 'listSchemas').mockRejectedValueOnce(new Error('foo'))
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    await waitForValueToChange(() => result.current.error, { timeout: 0 })
    expect(result.current.error).toEqual('Sorry, something went wrong.')
  })

  it('when route is index, returns edit state no schema', () => {
    ;(useRoute as jest.Mock).mockReturnValue({ route: indexRoute(), loading: false })
    const { result } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    expect(result.current.editState).toEqual({ type: SchemaEditStateType.NoSchema })
  })

  it('when route is view, returns edit state not editing', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })

    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    await waitForValueToChange(() => result.current.schema)

    expect(result.current.editState).toEqual({ type: SchemaEditStateType.NotEditing })
  })

  it('when route is edit schema, returns edit state editing schema', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: editSchemaRoute(schema.id),
      loading: false,
    })
    const { result, waitForNextUpdate } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await waitForNextUpdate()

    expect(result.current.editState).toEqual({ type: SchemaEditStateType.EditingSchema })
  })

  it('when route is edit model, returns edit state editing model', async () => {
    const modelId = schema.models[0].id
    ;(useRoute as jest.Mock).mockReturnValue({
      route: editModelRoute(schema.id, modelId),
      loading: false,
    })
    const { result, waitForNextUpdate } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await waitForNextUpdate()

    expect(result.current.editState).toEqual({
      type: SchemaEditStateType.EditingModel,
      id: modelId,
    })
  })

  it('calling edit navigates to the edit schema route', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })
    const { result, waitForNextUpdate } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    act(() => {
      result.current.edit()
    })

    await waitForNextUpdate()

    expect(goTo).toHaveBeenCalledWith(editSchemaRoute(schema.id))
  })

  it('calling editModel navigates to the edit model route', async () => {
    const modelId = schema.models[0].id
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })

    const { result, waitForValueToChange, waitFor } = renderHook<never, UseEditSchemaResult>(
      useEditSchema,
    )

    await waitForValueToChange(() => result.current.schema)

    act(() => {
      result.current.editModel(modelId)
    })

    await waitFor(() => true, { timeout: 0 })

    expect(goTo).toHaveBeenCalledWith(editModelRoute(schema.id, modelId))
  })

  it('calling edit model when there is no schema has no effect', async () => {
    const modelId = schema.models[0].id
    ;(useRoute as jest.Mock).mockReturnValue({
      route: noSchemaRoute(),
      loading: true,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await act(async () => {
      await result.current.editModel(modelId)
    })

    await waitForValueToChange(() => result.current.schema, { timeout: 1000 }).catch((e) => {
      expect(e.message.startsWith('Timed out')).toBe(true)
    })

    expect(goTo).not.toHaveBeenCalled()
  })

  it('calling cancel navigates to the view schema route', async () => {
    const modelId = schema.models[0].id
    ;(useRoute as jest.Mock).mockReturnValue({
      route: editModelRoute(schema.id, modelId),
      loading: false,
    })
    const { result, waitForNextUpdate } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    act(() => {
      result.current.cancel()
    })

    await waitForNextUpdate()

    expect(goTo).toHaveBeenCalledWith(viewSchemaRoute(schema.id))
  })

  it('calling destroy removes the schema and navigates to the index route', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)
    await waitForValueToChange(() => result.current.schema)

    await act(async () => {
      await result.current.destroy()
    })

    expect(goTo).toHaveBeenCalledWith(indexRoute())
    const schemas = await SchemaApi.listSchemas()
    expect(schemas.some((s) => s.id === schema.id)).toBe(false)
  })

  it('calling destroy when there is no schema has no effect', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: noSchemaRoute(),
      loading: true,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await act(async () => {
      await result.current.destroy()
    })

    await waitForValueToChange(() => result.current.schema, { timeout: 1000 }).catch((e) => {
      expect(e.message.startsWith('Timed out')).toBe(true)
    })

    expect(goTo).not.toHaveBeenCalled()
  })

  it('calling update updates the schema and navigates to the view schema route', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: editSchemaRoute(schema.id),
      loading: false,
    })
    const { result } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await act(async () => {
      await result.current.update({ ...schema, name: 'foo' })
    })

    expect(goTo).toHaveBeenCalledWith(viewSchemaRoute(schema.id))
    const updatedSchema = await SchemaApi.getSchema(schema.id)
    expect(updatedSchema.name).toBe('foo')
  })

  it('calling addModel adds a model the schema and navigates to the edit model route', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await waitForValueToChange(() => result.current.schema)

    await act(async () => {
      await result.current.addModel()
    })

    const updatedSchema = await SchemaApi.getSchema(schema.id)
    const modelId = updatedSchema.models[0].id

    expect(updatedSchema.models.length).toBe(schema.models.length + 1)
    expect(goTo).toHaveBeenCalledWith(editModelRoute(schema.id, modelId))
  })

  it('calling addModel when there is no schema has no effect', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: noSchemaRoute(),
      loading: true,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await act(async () => {
      await result.current.addModel()
    })

    await waitForValueToChange(() => result.current.schema, { timeout: 1000 }).catch((e) => {
      expect(e.message.startsWith('Timed out')).toBe(true)
    })

    expect(goTo).not.toHaveBeenCalled()
  })

  it('calling updateModel updates the model the schema and navigates to the view schema route', async () => {
    const model = schema.models[0]
    ;(useRoute as jest.Mock).mockReturnValue({
      route: editModelRoute(schema.id, model.id),
      loading: false,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await waitForValueToChange(() => result.current.schema)

    await act(async () => {
      await result.current.updateModel({ ...model, name: 'foo' })
    })

    const updatedModel = (await SchemaApi.getSchema(schema.id)).models[0]

    expect(updatedModel.name).toBe('foo')
    expect(goTo).toHaveBeenCalledWith(viewSchemaRoute(schema.id))
  })

  it('calling updateModel when there is no schema has no effect', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: noSchemaRoute(),
      loading: true,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await act(async () => {
      await result.current.updateModel(schema.models[0])
    })

    await waitForValueToChange(() => result.current.schema, { timeout: 1000 }).catch((e) => {
      expect(e.message.startsWith('Timed out')).toBe(true)
    })

    expect(goTo).not.toHaveBeenCalled()
  })

  it('calling delete model removes the model and all of its associations and navigates to the view schema route', async () => {
    const modelId = schema.models[0].id
    ;(useRoute as jest.Mock).mockReturnValue({
      route: viewSchemaRoute(schema.id),
      loading: false,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await waitForValueToChange(() => result.current.schema)

    await act(async () => {
      await result.current.deleteModel(modelId)
    })

    const updatedSchema = await SchemaApi.getSchema(schema.id)

    expect(updatedSchema.models.some((m) => m.id === modelId)).toBe(false)
    expect(updatedSchema.models.length).toBe(schema.models.length - 1)
    expect(
      updatedSchema.models.some((m) =>
        m.associations.some((a) => a.targetModelId === modelId || a.sourceModelId === modelId),
      ),
    ).toBe(false)
    expect(goTo).toHaveBeenCalledWith(viewSchemaRoute(schema.id))
  })

  it('calling deleteModel when there is no schema has no effect', async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      route: noSchemaRoute(),
      loading: true,
    })
    const { result, waitForValueToChange } = renderHook<never, UseEditSchemaResult>(useEditSchema)

    await act(async () => {
      await result.current.deleteModel(schema.models[0].id)
    })

    await waitForValueToChange(() => result.current.schema, { timeout: 1000 }).catch((e) => {
      expect(e.message.startsWith('Timed out')).toBe(true)
    })

    expect(goTo).not.toHaveBeenCalled()
  })
})
