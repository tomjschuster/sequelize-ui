import usePrevious from '@src/ui/hooks/usePrevious'
import { createFocusTrap, FocusTrap } from 'focus-trap'
import React from 'react'

type UseTrapFocusStateResult = {
  trapFocus: (trap: React.RefObject<HTMLElement>, global?: boolean) => void
  removeTrap: (trap: React.RefObject<HTMLElement>) => void
}

export default function useTrapFocusState(): UseTrapFocusStateResult {
  const [globalTraps, setGlobalTraps] = React.useState<React.RefObject<HTMLElement>[]>([])
  const [traps, setTraps] = React.useState<React.RefObject<HTMLElement>[]>([])
  const prevGlobalTraps = usePrevious(globalTraps)
  const prevTraps = usePrevious(traps)
  const focusTrap = React.useRef<FocusTrap>()

  const cleanup = React.useCallback(() => {
    focusTrap.current?.deactivate()
    focusTrap.current = undefined
  }, [])

  React.useEffect(() => {
    if (prevTraps === traps && prevGlobalTraps === globalTraps) return

    const globalElements = globalTraps
      .map((trap) => trap.current)
      .filter((el): el is HTMLElement => !!el)

    const element = traps.map((trap) => trap.current).filter((el): el is HTMLElement => !!el)[0]

    const elements = element ? [...globalElements, element] : globalElements

    if (elements.length > 0 && focusTrap.current) {
      focusTrap.current.updateContainerElements(elements)
      return
    }

    if (elements.length > 0) {
      focusTrap.current = createFocusTrap(elements, { escapeDeactivates: false })
      focusTrap.current.activate()
      return
    }

    cleanup()
  }, [prevTraps, traps, prevGlobalTraps, globalTraps])

  const trapFocus = React.useCallback(
    (ref: React.RefObject<HTMLElement>, global: boolean = false) => {
      if (global && !globalTraps.some((trap) => trap === ref)) {
        setGlobalTraps((traps) => traps.concat(ref))
        return
      }

      if (!traps.some((trap) => trap === ref)) {
        setTraps((traps) => traps.concat(ref))
        return
      }
    },
    [traps, globalTraps],
  )

  const removeTrap = React.useCallback((ref: React.RefObject<HTMLElement>) => {
    setGlobalTraps((traps) => traps.filter((trap) => trap !== ref))
    setTraps((traps) => traps.filter((trap) => trap !== ref))
  }, [])

  React.useEffect(() => cleanup, [])

  return { trapFocus, removeTrap }
}
