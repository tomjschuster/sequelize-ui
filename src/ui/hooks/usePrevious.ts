import React from 'react'

export default function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T | undefined>(undefined)
  React.useEffect(() => {
    ref.current = value
  })
  // eslint-disable-next-line react-hooks/refs
  return ref.current
}
