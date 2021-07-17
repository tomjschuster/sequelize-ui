import * as SchemaData from '@src/data/schemas'
import blogSchema from '@src/data/schemas/blog'
import sakilaSchema from '@src/data/schemas/sakila'
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'
import useDemoSchema, { UseDemoSchemaResult } from '../useDemoSchema'

describe('useDemoSchema', () => {
  it('returns an empty state when no type set', () => {
    const { result } = renderHook(useDemoSchema)

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.schema).toBeUndefined()
    expect(result.current.type).toBeUndefined()
  })

  it('initially returns loading when type set', async () => {
    const { result, waitForNextUpdate } = renderHook(useDemoSchema)

    act(() => {
      result.current.setType(SchemaData.DemoSchemaType.Blog)
    })
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.schema).toBeUndefined()
    expect(result.current.type).toBe(SchemaData.DemoSchemaType.Blog)

    // Fixes update to TestComponent warning
    return waitForNextUpdate()
  })

  it('returns the schema when loaded', async () => {
    const { result, waitForValueToChange } = renderHook<never, UseDemoSchemaResult>(useDemoSchema)

    act(() => {
      result.current.setType(SchemaData.DemoSchemaType.Blog)
    })

    await waitForValueToChange(() => result.current.schema)

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.schema).toEqual(blogSchema)
    expect(result.current.type).toBe(SchemaData.DemoSchemaType.Blog)
  })

  it('unsets the schema when type is removed', async () => {
    const { result, rerender, waitForValueToChange } = renderHook(useDemoSchema)

    act(() => {
      result.current.setType(SchemaData.DemoSchemaType.Blog)
    })

    await waitForValueToChange(() => result.current.schema)

    act(() => {
      result.current.setType(undefined)
    })

    rerender()

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.schema).toBeUndefined()
    expect(result.current.type).toBeUndefined()
  })

  it('sets an error when schema loading fails', async () => {
    jest.spyOn(SchemaData, 'getDemoSchema').mockRejectedValueOnce('foo')

    const { result, waitForValueToChange } = renderHook(useDemoSchema)

    act(() => {
      result.current.setType(SchemaData.DemoSchemaType.Blog)
    })

    await waitForValueToChange(() => result.current.error)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('foo')
    expect(result.current.schema).toBeUndefined()
    expect(result.current.type).toBe(SchemaData.DemoSchemaType.Blog)
  })

  it('does not set the schema if type has changed while loading', async () => {
    const { result, waitForValueToChange } = renderHook(useDemoSchema)

    act(() => {
      result.current.setType(SchemaData.DemoSchemaType.Blog)
      result.current.setType(SchemaData.DemoSchemaType.Sakila)
    })

    await waitForValueToChange(() => result.current.schema)
    expect(result.current.schema).toEqual(sakilaSchema)
  })
})
