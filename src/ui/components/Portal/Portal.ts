import { isBrowser } from '@src/utils/dom'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export const MODAL_PORTAL_ID = 'modal-container'

type PortalProps = {
  children: React.ReactNode
}

function Portal({ children }: PortalProps): React.ReactPortal | null {
  const [mounted, setMounted] = useState(false)
  const node = React.useMemo(() => isBrowser() && document.getElementById(MODAL_PORTAL_ID), [])

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  return mounted && node ? createPortal(children, node) : null
}

export default Portal
