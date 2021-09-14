import { act, renderHook } from '@testing-library/react-hooks'
import useIsOpen from '../useIsOpen'

describe('useIsOpen', () => {
  it('returns false by default', () => {
    const { result } = renderHook(useIsOpen)
    expect(result.current.isOpen).toBe(false)
  })

  it('returns true when initialized with false', () => {
    const { result } = renderHook(useIsOpen, { initialProps: false })
    expect(result.current.isOpen).toBe(false)
  })

  it('returns true when initialized with true', () => {
    const { result } = renderHook(useIsOpen, { initialProps: true })
    expect(result.current.isOpen).toBe(true)
  })

  it('returns true after calling open', () => {
    const { result } = renderHook(useIsOpen, { initialProps: false })
    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)
  })

  it('returns false after calling close', () => {
    const { result } = renderHook(useIsOpen, { initialProps: true })
    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('toggles from true to false', () => {
    const { result } = renderHook(useIsOpen, { initialProps: true })
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('toggles from false to true', () => {
    const { result } = renderHook(useIsOpen, { initialProps: false })
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(true)
  })
})
