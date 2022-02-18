import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import React from 'react'

type UseLockScrollArgs = {
  ref: React.RefObject<HTMLElement>
  skip?: boolean
}

export default function useLockScroll({ ref, skip }: UseLockScrollArgs): void {
  React.useEffect(() => {
    if (ref.current && !skip) {
      disableBodyScroll(ref.current)
    } else {
      clearAllBodyScrollLocks()
    }

    return clearAllBodyScrollLocks
  }, [ref, skip])
}
