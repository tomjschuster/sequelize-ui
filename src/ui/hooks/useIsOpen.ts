import React from 'react'

type UseIsOpenResult = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export default function useIsOpen(initialState = false): UseIsOpenResult {
  const [isOpen, setIsOpen] = React.useState(initialState)
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen((x) => !x), [])

  return { isOpen, open, close, toggle }
}
