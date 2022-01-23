import useDarkModeInternal, { UseDarkModeResult } from '@src/ui/hooks/useDarkMode'
import React from 'react'

type DarkModeContext = UseDarkModeResult
const DarkModeContext = React.createContext<DarkModeContext>({
  darkMode: false,
  isExplicit: false,
  setDarkMode: () => void 0,
})

export type DarkModeProviderProps = React.PropsWithChildren<{ initialDarkMode?: boolean }>

export function DarkModeProvider({
  initialDarkMode = false,
  children,
}: DarkModeProviderProps): React.ReactElement {
  const value = useDarkModeInternal({ initialDarkMode })
  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>
}

export function useDarkMode(): DarkModeContext {
  return React.useContext(DarkModeContext)
}
