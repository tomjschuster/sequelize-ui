import blogSchema from '@src/api/schema/examples/blog'
import { defaultDbOptions, SqlDialect } from '@src/core/database'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import { renderHook } from '@testing-library/react-hooks'
import useGeneratedCode, { UseGeneratedCodeArgs, UseGeneratedCodeResult } from '../useGeneratedCode'

describe('useGeneratedCode', () => {
  it('initially returns no framework and no root', () => {
    const { result, waitForNextUpdate } = renderHook<UseGeneratedCodeArgs, UseGeneratedCodeResult>(
      useGeneratedCode,
      { initialProps: { dbOptions: defaultDbOptions } },
    )

    expect(result.current.framework).toBeUndefined()
    expect(result.current.root).toBeUndefined()

    // Fixes update to TestComponent warning
    return waitForNextUpdate()
  })

  it('returns the Sequelize framework after load', async () => {
    const { result, waitForValueToChange } = renderHook<
      UseGeneratedCodeArgs,
      UseGeneratedCodeResult
    >(useGeneratedCode, { initialProps: { dbOptions: defaultDbOptions } })

    await waitForValueToChange(() => result.current.framework)
    expect(result.current.framework).toEqual(SequelizeFramework)
  })

  it('returns a root generated from the current framework and schema', async () => {
    const { result, waitForValueToChange } = renderHook<
      UseGeneratedCodeArgs,
      UseGeneratedCodeResult
    >(useGeneratedCode, { initialProps: { dbOptions: defaultDbOptions, schema: blogSchema } })

    await waitForValueToChange(() => result.current.root)

    expect(result.current.root).not.toBeUndefined()
    expect(result.current.root).toEqual(
      result.current.framework?.generate({ schema: blogSchema, dbOptions: defaultDbOptions }),
    )
  })

  it('updates the root when the schema changes', async () => {
    const { result, rerender, waitForValueToChange } = renderHook<
      UseGeneratedCodeArgs,
      UseGeneratedCodeResult
    >(useGeneratedCode, { initialProps: { dbOptions: defaultDbOptions, schema: blogSchema } })

    const updatedSchema = { ...blogSchema, name: 'foo' }
    rerender({ schema: updatedSchema, dbOptions: defaultDbOptions })

    await waitForValueToChange(() => result.current.root)

    expect(result.current.root).toEqual(
      result.current.framework?.generate({ schema: updatedSchema, dbOptions: defaultDbOptions }),
    )
  })

  it('updates the root when the dbOptions changes', async () => {
    const { result, rerender, waitForValueToChange } = renderHook<
      UseGeneratedCodeArgs,
      UseGeneratedCodeResult
    >(useGeneratedCode, { initialProps: { dbOptions: defaultDbOptions, schema: blogSchema } })

    const updatedOptions = { ...defaultDbOptions, sqlDialect: SqlDialect.MsSql }
    rerender({ schema: blogSchema, dbOptions: updatedOptions })

    await waitForValueToChange(() => result.current.root)

    expect(result.current.root).toEqual(
      result.current.framework?.generate({ schema: blogSchema, dbOptions: updatedOptions }),
    )
  })
})
