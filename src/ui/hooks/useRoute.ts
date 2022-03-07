import { parseRoute, Route } from '@src/ui/routing/routes'
import { useRouter } from 'next/router'
import React from 'react'

export type UseRouteResult = {
  loading: boolean
  route: Route | undefined
}

export default function useRoute(): UseRouteResult {
  const router = useRouter()
  const { pathname, query, isReady } = router
  const route = React.useMemo(
    () => (isReady ? parseRoute(pathname, query) : undefined),
    [isReady, pathname, query],
  )
  return { route, loading: !isReady }
}
