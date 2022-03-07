import React from 'react'
import {
  getPrefersDarkModeMql,
  prefersDarkModeExplicit,
  setPrefersDarkModeExplicit,
  syncDomDarkMode,
} from '../utils/darkMode'

export type UseDarkModeResult = {
  darkMode: boolean
  isExplicit: boolean
  setDarkMode: (value: boolean | null) => void
}

type UseDarkModeProps = { initialDarkMode: boolean }

export default function useDarkMode(
  { initialDarkMode }: UseDarkModeProps = { initialDarkMode: false },
): UseDarkModeResult {
  const [explicitDarkModeState, setExplicitDarkModeState] = React.useState<boolean | null>(null)
  const prefersDarkMode = usePrefersDarkMode({ initialDarkMode })
  const darkMode =
    typeof explicitDarkModeState === 'boolean' ? explicitDarkModeState : prefersDarkMode

  React.useEffect(() => {
    setExplicitDarkModeState(prefersDarkModeExplicit())
  }, [])

  const setDarkMode = React.useCallback((value: boolean | null) => {
    setExplicitDarkModeState(value)
    setPrefersDarkModeExplicit(value)
  }, [])

  React.useEffect(() => {
    syncDomDarkMode(darkMode)
  }, [darkMode])

  const result = React.useMemo(
    () => ({
      darkMode,
      isExplicit: explicitDarkModeState !== null,
      setDarkMode,
    }),
    [darkMode, explicitDarkModeState, setDarkMode],
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
  }, [mediaQueryList])

  return prefersDarkMode
}
