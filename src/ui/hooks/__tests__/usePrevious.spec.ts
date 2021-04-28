import { renderHook } from '@testing-library/react-hooks'
import usePrevious from '../usePrevious'

describe('usePrevious', () => {
  it('returns undefined on first render', () => {
    const { result } = renderHook(({ state }) => usePrevious(state), {
      initialProps: { state: 1 },
    })

    expect(result.current).toBeUndefined()
  })

  it('returns the previous rendered value', () => {
    const { result, rerender } = renderHook(({ state }) => usePrevious(state), {
      initialProps: { state: 1 },
    })

    rerender({ state: 2 })
    expect(result.current).toBe(1)

    rerender({ state: 3 })
    expect(result.current).toBe(2)

    rerender({ state: 4 })
    expect(result.current).toBe(3)
  })
})
