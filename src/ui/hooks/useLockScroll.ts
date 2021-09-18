import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import React from 'react'

export default function useLockScroll(ref: React.RefObject<HTMLElement>): void {
  React.useEffect(() => {
    if (ref.current) {
      disableBodyScroll(ref.current)
    } else {
      clearAllBodyScrollLocks()
    }

    return clearAllBodyScrollLocks
  }, [ref])
}
