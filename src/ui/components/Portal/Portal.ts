import { isBrowser } from '@src/utils/dom'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = React.PropsWithChildren<{
  id: string
}>

function Portal({ id, children }: PortalProps): React.ReactPortal | null {
  const [mounted, setMounted] = useState(false)
  const node = React.useMemo(() => isBrowser() && document.getElementById(id), [])

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  return mounted && node ? createPortal(children, node) : null
}

export default Portal
