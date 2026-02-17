import blogSchema from '@src/api/schema/examples/blog'
import { defaultDbOptions, SqlDialect } from '@src/core/database'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import { renderHook, waitFor } from '@testing-library/react'
import useGeneratedCode, { UseGeneratedCodeArgs, UseGeneratedCodeResult } from '../useGeneratedCode'

describe('useGeneratedCode', () => {
  it('initially returns no framework and no root', () => {
    const { result } = renderHook<UseGeneratedCodeResult, UseGeneratedCodeArgs>(useGeneratedCode, {
      initialProps: { dbOptions: defaultDbOptions },
    })

    expect(result.current.framework).toBeUndefined()
    expect(result.current.root).toBeUndefined()
  })

  it('returns the Sequelize framework after load', async () => {
    const { result } = renderHook<UseGeneratedCodeResult, UseGeneratedCodeArgs>(useGeneratedCode, {
      initialProps: { dbOptions: defaultDbOptions },
    })

    await waitFor(() => {
      expect(result.current.framework).toEqual(SequelizeFramework)
    })
  })

  it('returns a root generated from the current framework and schema', async () => {
    const { result } = renderHook<UseGeneratedCodeResult, UseGeneratedCodeArgs>(useGeneratedCode, {
      initialProps: { dbOptions: defaultDbOptions, schema: blogSchema },
    })

    await waitFor(() => {
      expect(result.current.root).not.toBeUndefined()
      expect(result.current.root).toEqual(
        result.current.framework?.generate({ schema: blogSchema, dbOptions: defaultDbOptions }),
      )
    })
  })

  it('updates the root when the schema changes', async () => {
    const { result, rerender } = renderHook<UseGeneratedCodeResult, UseGeneratedCodeArgs>(
      useGeneratedCode,
      { initialProps: { dbOptions: defaultDbOptions, schema: blogSchema } },
    )

    const updatedSchema = { ...blogSchema, name: 'foo' }
    rerender({ schema: updatedSchema, dbOptions: defaultDbOptions })

    await waitFor(() => {
      expect(result.current.root).toEqual(
        result.current.framework?.generate({ schema: updatedSchema, dbOptions: defaultDbOptions }),
      )
    })
  })

  it('updates the root when the dbOptions changes', async () => {
    const { result, rerender } = renderHook<UseGeneratedCodeResult, UseGeneratedCodeArgs>(
      useGeneratedCode,
      { initialProps: { dbOptions: defaultDbOptions, schema: blogSchema } },
    )

    const updatedOptions = { ...defaultDbOptions, sqlDialect: SqlDialect.MsSql }
    rerender({ schema: blogSchema, dbOptions: updatedOptions })

    await waitFor(() => {
      expect(result.current.root).toEqual(
        result.current.framework?.generate({ schema: blogSchema, dbOptions: updatedOptions }),
      )
    })
  })
})
