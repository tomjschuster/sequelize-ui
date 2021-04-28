import { parseRoute, Route } from '@src/routing/routes'
import { NextRouter, useRouter } from 'next/router'
import { useMemo } from 'react'

type UseRouteResult = {
  loading: boolean
  route: Route | undefined
  router: NextRouter
}

export default function useRoute(): UseRouteResult {
  const router = useRouter()
  const { pathname, query, isReady } = router
  const route = useMemo(() => parseRoute(pathname, query), [pathname, query])
  return { route, router, loading: !isReady }
}
