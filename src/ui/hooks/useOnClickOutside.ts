import React from 'react'

type AnyEvent = MouseEvent | TouchEvent

export default function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  onClick: (event: AnyEvent) => void,
): void {
  React.useEffect(() => {
    const listener = (event: AnyEvent) => {
      const el = ref?.current

      if (!el || el.contains(event.target as Node)) {
        return
      }

      onClick(event)
    }

    document.addEventListener(`click`, listener)

    return () => {
      document.removeEventListener(`click`, listener)
    }
  }, [ref, onClick])
}
