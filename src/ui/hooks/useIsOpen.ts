import { useCallback, useState } from 'react'

type UseIsOpenResult = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export default function useIsOpen(initialState = false): UseIsOpenResult {
  const [isOpen, setIsOpen] = useState(initialState)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((x) => !x), [])

  return { isOpen, open, close, toggle }
}
