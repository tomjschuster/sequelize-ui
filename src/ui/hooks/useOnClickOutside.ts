import React from 'react'

type AnyEvent = MouseEvent | TouchEvent

export default function useOnClickOutside(
  refs: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  onClick: (event: AnyEvent) => void,
): void {
  React.useEffect(() => {
    const listener = (event: AnyEvent) => {
      const els = 'current' in refs ? [refs] : refs

      if (els.some((el) => el.current?.contains(event.target as Node))) {
        return
      }

      onClick(event)
    }

    document.addEventListener(`click`, listener)

    return () => {
      document.removeEventListener(`click`, listener)
    }
  }, [refs, onClick])
}
