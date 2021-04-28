import * as SchemaData from '@src/data/schemas'
import employeeTemporalDatasetSchema from '@src/data/schemas/employeeTemporalDataset'
import sakilaSchema from '@src/data/schemas/sakila'
import { renderHook } from '@testing-library/react-hooks'
import useDemoSchema, { UseDemoSchemaArgs, UseDemoSchemaResult } from '../useDemoSchema'

describe('useDemoSchema', () => {
  it('returns an empty state when no type provided', () => {
    const { result } = renderHook(({ type }) => useDemoSchema({ type }), {
      initialProps: { type: undefined },
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.schema).toBeUndefined()
  })

  it('initially returns loading when type provided', async () => {
    const { result, waitForNextUpdate } = renderHook(({ type }) => useDemoSchema({ type }), {
      initialProps: { type: SchemaData.DemoSchemaType.Blog },
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.schema).toBeUndefined()

    // Fixes update to TestComponent warning
    return waitForNextUpdate()
  })

  it('returns the schema when loaded', async () => {
    const { result, waitForValueToChange } = renderHook<UseDemoSchemaArgs, UseDemoSchemaResult>(
      ({ type }) => useDemoSchema({ type }),
      {
        initialProps: { type: SchemaData.DemoSchemaType.EmployeeTemporalDataset },
      },
    )

    await waitForValueToChange(() => result.current.schema)

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.schema).toEqual(employeeTemporalDatasetSchema)
  })

  it('unsets the schema when type is removed', async () => {
    const { result, rerender, waitForValueToChange } = renderHook<
      UseDemoSchemaArgs,
      UseDemoSchemaResult
    >(({ type }) => useDemoSchema({ type }), {
      initialProps: { type: SchemaData.DemoSchemaType.Blog },
    })

    await waitForValueToChange(() => result.current.schema)
    rerender({ type: undefined })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.schema).toBeUndefined()
  })

  it('sets an error when schema loaidng fails', async () => {
    jest.spyOn(SchemaData, 'getDemoSchema').mockRejectedValueOnce('foo')

    const { result, waitForValueToChange } = renderHook<UseDemoSchemaArgs, UseDemoSchemaResult>(
      ({ type }) => useDemoSchema({ type }),
      {
        initialProps: { type: SchemaData.DemoSchemaType.Blog },
      },
    )

    await waitForValueToChange(() => result.current.error)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('foo')
    expect(result.current.schema).toBeUndefined()
  })

  it('does not set the schema if type has changed while loading', async () => {
    const { result, rerender, waitForValueToChange } = renderHook<
      UseDemoSchemaArgs,
      UseDemoSchemaResult
    >(({ type }) => useDemoSchema({ type }), {
      initialProps: { type: SchemaData.DemoSchemaType.Blog },
    })

    rerender({ type: SchemaData.DemoSchemaType.Sakila })

    await waitForValueToChange(() => result.current.schema)
    expect(result.current.schema).toEqual(sakilaSchema)
  })

  it('does not set error if type has changed while loading', async () => {
    jest.spyOn(SchemaData, 'getDemoSchema').mockRejectedValueOnce('foo')
    jest.spyOn(SchemaData, 'getDemoSchema').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(sakilaSchema), 1)
        }),
    )

    const { result, rerender, waitForValueToChange } = renderHook<
      UseDemoSchemaArgs,
      UseDemoSchemaResult
    >(({ type }) => useDemoSchema({ type }), {
      initialProps: { type: SchemaData.DemoSchemaType.Blog },
    })

    rerender({ type: SchemaData.DemoSchemaType.Sakila })

    await waitForValueToChange(() => result.current.error, { interval: 1 }).catch((e) => {
      expect(e.message.startsWith('Timed out')).toBe(true)
    })

    expect(result.current.error).toBeUndefined()
  })
})
