import { ParsedUrlQuery } from 'querystring'

export enum RouteType {
  NotFound = 'NOT_FOUND',
  Index = 'INDEX',
}

export type BaseRoute<T = RouteType> = { type: T }
export type NotFoundRoute = BaseRoute<typeof RouteType.NotFound>
export type IndexRoute = BaseRoute<typeof RouteType.Index>

export type Route = NotFoundRoute | IndexRoute

export function notFoundRoute(): NotFoundRoute {
  return { type: RouteType.NotFound }
}

export function indexRoute(): IndexRoute {
  return { type: RouteType.Index }
}

export function parseRoute(pathname: string, _query: ParsedUrlQuery): Route {
  const isIndexPath = pathname === '/'
  if (isIndexPath) return indexRoute()

  return notFoundRoute()
}

export function routeToUrl(route: Route): string {
  switch (route.type) {
    case RouteType.NotFound:
      return '/'
    case RouteType.Index:
      return '/'
  }
}

export function routesMatch(a: Route, b: Route): boolean {
  return Object.entries(a as Record<string, unknown>).every(
    ([k, v]: [string, unknown]) => (b as Record<string, unknown>)[k] === v,
  )
}
