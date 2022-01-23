import { isBrowser } from '@src/utils/dom'
import { get, remove, set } from '@src/utils/localStorage'
import React from 'react'

const LOCAL_STORAGE_KEY = 'dark-mode-enabled'

export type UseDarkModeResult = {
  darkMode: boolean
  isExplicit: boolean
  setDarkMode: (value: boolean | null) => void
}

type UseDarkModeProps = { initialDarkMode: boolean }
export default function useDarkMode(
  { initialDarkMode }: UseDarkModeProps = { initialDarkMode: false },
): UseDarkModeResult {
  const [explicitDarkMode, setExplicitDarkMode] = React.useState<boolean | null>(false)
  const prefersDarkMode = usePrefersDarkMode({ initialDarkMode })
  const darkMode = typeof explicitDarkMode === 'boolean' ? explicitDarkMode : prefersDarkMode

  React.useEffect(() => {
    setExplicitDarkMode(get(LOCAL_STORAGE_KEY))
  }, [])

  const setDarkMode = React.useCallback((value: boolean | null) => {
    setExplicitDarkMode(value)
    if (typeof value === 'boolean') {
      set(LOCAL_STORAGE_KEY, value)
    } else {
      remove(LOCAL_STORAGE_KEY)
    }
  }, [])

  React.useEffect(() => {
    const className = 'dark'
    const element = window.document.body
    if (darkMode) {
      element.classList.add(className)
    } else {
      element.classList.remove(className)
    }
    window.requestAnimationFrame(() => void 0)
  }, [darkMode])

  const result = React.useMemo(
    () => ({
      darkMode,
      isExplicit: explicitDarkMode !== null,
      setDarkMode,
    }),
    [darkMode, explicitDarkMode, setDarkMode],
  )

  return result
}

export function usePrefersDarkMode(
  { initialDarkMode }: UseDarkModeProps = { initialDarkMode: false },
): boolean {
  const mediaQueryList = React.useMemo(getPrefersDarkModeMql, [])
  const [prefersDarkMode, setPrefersDarkMode] = React.useState<boolean>(initialDarkMode)

  React.useEffect(() => {
    setPrefersDarkMode(mediaQueryList?.matches || false)
    const handler = () => setPrefersDarkMode(mediaQueryList?.matches || false)
    mediaQueryList?.addEventListener('change', handler)
    return () => mediaQueryList?.removeEventListener('change', handler)
  }, [])

  return prefersDarkMode
}

function getPrefersDarkModeMql(): MediaQueryList | undefined {
  return isBrowser() ? window.matchMedia('(prefers-color-scheme: dark)') : undefined
}
