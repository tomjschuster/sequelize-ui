import { isBrowser } from '@src/utils/dom'
import { parse, ParsedUrlQuery } from 'querystring'

export enum RouteType {
  NotFound = 'NOT_FOUND',
  Index = 'INDEX',
  Privacy = 'PRIVACY',
  NewSchema = 'NEW_SCHEMA',
  Schema = 'SCHEMA',
  ExampleSchema = 'EXAMPLE_SCHEMA',
}

export type BaseRoute<T = RouteType, P = undefined> = P extends undefined
  ? { type: T }
  : { type: T } & P

export type NotFoundRoute = BaseRoute<typeof RouteType.NotFound>
export type IndexRoute = BaseRoute<typeof RouteType.Index>
export type PrivacyRoute = BaseRoute<typeof RouteType.Privacy>
export type NewSchemaRoute = BaseRoute<typeof RouteType.NewSchema>
export type SchemaRoute = BaseRoute<typeof RouteType.Schema, { id: string }>
export type ExampleSchemaRoute = BaseRoute<typeof RouteType.ExampleSchema, { slug: string }>

export type Route =
  | NotFoundRoute
  | IndexRoute
  | PrivacyRoute
  | NewSchemaRoute
  | SchemaRoute
  | ExampleSchemaRoute

export function notFoundRoute(): NotFoundRoute {
  return { type: RouteType.NotFound }
}

export function indexRoute(): IndexRoute {
  return { type: RouteType.Index }
}

export function privacyRoute(): PrivacyRoute {
  return { type: RouteType.Privacy }
}

export function newSchemaRoute(): NewSchemaRoute {
  return { type: RouteType.NewSchema }
}

export function schemaRoute(id: string): SchemaRoute {
  return { type: RouteType.Schema, id }
}

export function exampleSchemaRoute(slug: string): ExampleSchemaRoute {
  return { type: RouteType.ExampleSchema, slug }
}

export function parseRoute(pathname: string, query: ParsedUrlQuery): Route {
  const isIndexPath = pathname === '/'
  if (isIndexPath) return indexRoute()

  const isPrivacyPath = pathname === '/privacy'
  if (isPrivacyPath) return newSchemaRoute()

  const isNewSchemaPath = pathname === '/schema/new'
  if (isNewSchemaPath) return newSchemaRoute()

  const slug = parseExampleSchemaSlug(pathname)
  const isExampleSchemaPath = !!slug
  if (isExampleSchemaPath) return exampleSchemaRoute(slug)

  const schemaId = parseSchemaId(query)
  const isSchemaPath = pathname === '/schema' && !!schemaId
  if (isSchemaPath) return schemaRoute(schemaId)

  return notFoundRoute()
}

export function parseExampleSchemaSlug(pathname: string): string | undefined {
  const matches = pathname.match(/^\/schema\/([\w-]+)$/)
  return matches?.[1]
}

export function parseSchemaId(query: ParsedUrlQuery): string | undefined {
  return typeof query.id === 'string' && query.id.length > 0 ? query.id : undefined
}

export function routeToUrl(route: Route): string {
  switch (route.type) {
    case RouteType.NotFound:
      return '/'
    case RouteType.Index:
      return '/'
    case RouteType.Privacy:
      return '/privacy'
    case RouteType.NewSchema:
      return '/schema/new'
    case RouteType.Schema:
      return `/schema?id=${route.id}`
    case RouteType.ExampleSchema:
      return `/schema/${route.slug}`
  }
}

export function routesMatch(a: Route, b: Route): boolean {
  return Object.entries(a as Record<string, unknown>).every(
    ([k, v]: [string, unknown]) => (b as Record<string, unknown>)[k] === v,
  )
}

export function currentRoute(): Route | undefined {
  if (!isBrowser()) return undefined
  const query = parse(window.location.search)
  return parseRoute(window.location.pathname, query)
}

export function isOnRoute(type: RouteType): boolean {
  const route = currentRoute()
  return !!route && route.type === type
}

export function isOnIndex(): boolean {
  return isOnRoute(RouteType.Index)
}
