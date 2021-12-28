import { DemoSchemaType, getDemoSchemaId, getDemoSchemaType } from '@src/data/schemas'
import { ParsedUrlQuery } from 'querystring'

export enum RouteType {
  NotFound = 'NOT_FOUND',
  Index = 'INDEX',
  NewSchema = 'NEW_SCHEMA',
  Schema = 'SCHEMA',
  DemoSchema = 'DEMO_SCHEMA',
}

export type BaseRoute<T = RouteType, P = undefined> = P extends undefined
  ? { type: T }
  : { type: T } & P

export type NotFoundRoute = BaseRoute<typeof RouteType.NotFound>
export type IndexRoute = BaseRoute<typeof RouteType.Index>
export type NewSchemaRoute = BaseRoute<typeof RouteType.NewSchema>
export type SchemaRoute = BaseRoute<typeof RouteType.Schema, { id: string }>
export type DemoSchemaRoute = BaseRoute<typeof RouteType.DemoSchema, { schemaType: DemoSchemaType }>

export type Route = NotFoundRoute | IndexRoute | NewSchemaRoute | SchemaRoute | DemoSchemaRoute

export function notFoundRoute(): NotFoundRoute {
  return { type: RouteType.NotFound }
}

export function indexRoute(): IndexRoute {
  return { type: RouteType.Index }
}

export function newSchemaRoute(): NewSchemaRoute {
  return { type: RouteType.NewSchema }
}

export function schemaRoute(id: string): SchemaRoute {
  return { type: RouteType.Schema, id }
}

export function demoSchemaRoute(schemaType: DemoSchemaType): DemoSchemaRoute {
  return { type: RouteType.DemoSchema, schemaType }
}

export function parseRoute(pathname: string, query: ParsedUrlQuery): Route {
  const isIndexPath = pathname === '/'
  if (isIndexPath) return indexRoute()

  const isNewSchemaPath = pathname === '/new'
  if (isNewSchemaPath) return newSchemaRoute()

  const demoSchemaType = parseDemoSchemaType(pathname)
  const isDemoSchemaPath = !!demoSchemaType
  if (isDemoSchemaPath) return demoSchemaRoute(demoSchemaType)

  const schemaId = parseSchemaId(query)
  const isSchemaPath = pathname === '/schema' && !!schemaId
  if (isSchemaPath) return schemaRoute(schemaId)

  return notFoundRoute()
}

export function parseDemoSchemaType(pathname: string): DemoSchemaType | undefined {
  const matches = pathname.match(/^\/schema\/([\w-]+)$/)
  const schemaId = matches?.[1]
  return schemaId !== undefined ? getDemoSchemaType(schemaId) : undefined
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
    case RouteType.NewSchema:
      return '/new'
    case RouteType.Schema:
      return `/schema?id=${route.id}`
    case RouteType.DemoSchema:
      return `/schema/${getDemoSchemaId(route.schemaType)}`
  }
}

export function routesMatch(a: Route, b: Route): boolean {
  return Object.entries(a as Record<string, unknown>).every(
    ([k, v]: [string, unknown]) => (b as Record<string, unknown>)[k] === v,
  )
}
