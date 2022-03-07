import usePrevious from '@src/ui/hooks/usePrevious'
import { isBrowser } from '@src/utils/dom'
import { createFocusTrap, FocusTrap } from 'focus-trap'
import React from 'react'

type TrapElements = [trap: React.RefObject<HTMLElement>, activeElement: Element | null]

type UseTrapFocusStateResult = {
  trapFocus: (trap: React.RefObject<HTMLElement>, global?: boolean) => void
  removeTrap: (trap: React.RefObject<HTMLElement>) => void
}

export default function useTrapFocusState(): UseTrapFocusStateResult {
  const [globalTraps, setGlobalTraps] = React.useState<React.RefObject<HTMLElement>[]>([])
  const [traps, setTraps] = React.useState<TrapElements[]>([])
  const prevGlobalTraps = usePrevious(globalTraps)
  const prevTraps = usePrevious(traps)
  const focusTrap = React.useRef<FocusTrap>()

  const cleanup = React.useCallback(() => {
    focusTrap.current?.deactivate()
    focusTrap.current = undefined
  }, [])

  React.useEffect(() => {
    // noop when traps have not changed
    if (prevTraps === traps && prevGlobalTraps === globalTraps) return

    const elements = getCurrentTrapElements(traps, globalTraps)

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
  }, [prevTraps, traps, prevGlobalTraps, globalTraps, cleanup])

  const trapFocus = React.useCallback(
    (ref: React.RefObject<HTMLElement>, global: boolean = false) => {
      if (global && !globalTraps.some((trap) => trap === ref)) {
        setGlobalTraps((traps) => traps.concat(ref))
        return
      }

      if (!traps.some(([trap]) => trap === ref)) {
        const prevFocus = isBrowser() ? document.activeElement : null
        setTraps((traps) => traps.concat([[ref, prevFocus]]))
        return
      }
    },
    [traps, globalTraps],
  )

  const removeTrap = React.useCallback(
    (ref: React.RefObject<HTMLElement>) => {
      // If removing current trap, revert focus to previously focused element
      const currentTrap = traps[traps.length - 1]
      if (currentTrap && ref === currentTrap[0] && currentTrap[1] instanceof HTMLElement) {
        currentTrap[1].focus()
      }

      setGlobalTraps((traps) => traps.filter((trap) => trap !== ref))
      setTraps((traps) => traps.filter(([trap]) => trap !== ref))
    },
    [traps],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => cleanup, [])

  return { trapFocus, removeTrap }
}

function getCurrentTrapElements(
  traps: TrapElements[],
  globalTraps: React.RefObject<HTMLElement>[],
): HTMLElement[] {
  const topTrapElement = traps
    .map(([trap]) => trap.current)
    .filter((el): el is HTMLElement => !!el)[0]

  const globalElements = globalTraps
    .map((trap) => trap.current)
    .filter((el): el is HTMLElement => !!el)

  // We only need to trap global elements when there is a regular trap element.
  // Otherwise global elements are part of normal flow
  return topTrapElement ? [...globalElements, topTrapElement] : []
}
