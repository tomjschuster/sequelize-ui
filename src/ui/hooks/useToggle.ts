import React from 'react'

export type UseToggleResult = {
  state: boolean
  setState: (value: boolean) => void
  toggle: () => void
  setOn: () => void
  setOff: () => void
}

export default function useToggle(initialValue?: boolean): UseToggleResult {
  const [state, setState] = React.useState<boolean>(!!initialValue)

  const toggle = React.useCallback(() => setState((v) => !v), [])
  const setOn = React.useCallback(() => setState(true), [])
  const setOff = React.useCallback(() => setState(false), [])

  return { state, setState, toggle, setOn, setOff }
}
