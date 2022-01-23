import useDarkModeInternal, { UseDarkModeResult } from '@src/ui/hooks/useDarkMode'
import React from 'react'

type DarkModeContext = UseDarkModeResult
const DarkModeContext = React.createContext<DarkModeContext>({
  darkMode: false,
  isExplicit: false,
  setDarkMode: () => void 0,
})

export function DarkModeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const value = useDarkModeInternal()
  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>
}

export function useDarkMode(): DarkModeContext {
  return React.useContext(DarkModeContext)
}
