import React from 'react'
import useTrapFocusState from './internal/useTrapFocusState'

type FocusContext = {
  trapFocus: (trap: React.RefObject<HTMLElement>, append?: boolean) => void
  removeTrap: (trap: React.RefObject<HTMLElement>) => void
}
const FocusContext = React.createContext<FocusContext>({
  trapFocus: () => null,
  removeTrap: () => null,
})

export function FocusProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const context = useTrapFocusState()
  return <FocusContext.Provider value={context}>{children}</FocusContext.Provider>
}

type UseTrapFocusArgs = {
  ref: React.RefObject<HTMLElement>
  skip?: boolean
  global?: boolean
}

export function useTrapFocus({ ref, skip, global }: UseTrapFocusArgs): void {
  const { trapFocus, removeTrap } = React.useContext(FocusContext)

  React.useEffect(() => {
    if (!skip && ref.current) {
      trapFocus(ref, global)
    } else {
      removeTrap(ref)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ref, global])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => () => removeTrap(ref), [ref])
}
