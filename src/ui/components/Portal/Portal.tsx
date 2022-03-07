import { isBrowser } from '@src/utils/dom'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ErrorBoundary from '../ErrorBoundary'

type PortalProps = React.PropsWithChildren<{
  id: string
}>

function Portal({ id, children }: PortalProps): React.ReactPortal | null {
  const [mounted, setMounted] = useState(false)
  const node = React.useMemo(() => isBrowser() && document.getElementById(id), [id])

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  return mounted && node ? createPortal(<ErrorBoundary>{children}</ErrorBoundary>, node) : null
}

export default Portal
