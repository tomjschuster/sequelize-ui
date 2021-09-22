import { createFocusTrap, FocusTrap } from 'focus-trap'
import React from 'react'

type UseTrapFocusArgs = {
  shouldTrap: boolean
  ref: React.RefObject<HTMLElement>
}

export default function useTrapFocus({ shouldTrap, ref }: UseTrapFocusArgs): void {
  const focusTrap = React.useRef<FocusTrap>()

  const cleanup = React.useCallback(() => {
    focusTrap.current?.deactivate()
    focusTrap.current = undefined
  }, [])

  const setTrap = React.useCallback((trap: HTMLElement) => {
    cleanup()
    focusTrap.current = createFocusTrap(trap, { escapeDeactivates: false })
    focusTrap.current.activate()
  }, [])

  React.useEffect(() => {
    if (shouldTrap && ref.current) setTrap(ref.current)
    if (!shouldTrap) cleanup()
  }, [shouldTrap])

  React.useEffect(() => cleanup, [])
}
