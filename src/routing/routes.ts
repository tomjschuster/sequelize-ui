import { Model, Schema } from '@src/core/schema'
import { getQsBoolean, getQsString } from '@src/core/utils/url'
import { ParsedUrlQuery } from 'node:querystring'

export enum RouteType {
  NotFound = 'NOT_FOUND',
  Index = 'INDEX',
  NoSchema = 'NO_SCHEMA',
  ViewSchema = 'VIEW_SCHEMA',
  EditSchema = 'EDIT_SCHEMA',
  EditModel = 'EDIT_MODEL',
}

export type BaseRoute<T = RouteType> = { type: T }
export type NotFoundRoute = BaseRoute<typeof RouteType.NotFound>
export type IndexRoute = BaseRoute<typeof RouteType.Index>
export type NoSchemaRoute = BaseRoute<typeof RouteType.NoSchema>
export type ViewSchemaRoute = BaseRoute<typeof RouteType.ViewSchema> & { schemaId: Schema['id'] }
export type EditSchemaRoute = BaseRoute<typeof RouteType.EditSchema> & { schemaId: Schema['id'] }

export type EditModelRoute = BaseRoute<typeof RouteType.EditModel> & {
  schemaId: Schema['id']
  modelId: Model['id']
}

export type Route =
  | NotFoundRoute
  | IndexRoute
  | NoSchemaRoute
  | ViewSchemaRoute
  | EditSchemaRoute
  | EditModelRoute

export function notFoundRoute(): NotFoundRoute {
  return { type: RouteType.NotFound }
}

export function indexRoute(): IndexRoute {
  return { type: RouteType.Index }
}

export function noSchemaRoute(): NoSchemaRoute {
  return { type: RouteType.NoSchema }
}

export function viewSchemaRoute(schemaId: Schema['id']): ViewSchemaRoute {
  return { type: RouteType.ViewSchema, schemaId }
}

export function editSchemaRoute(schemaId: Schema['id']): EditSchemaRoute {
  return { type: RouteType.EditSchema, schemaId }
}

export function editModelRoute(schemaId: Schema['id'], modelId: Model['id']): EditModelRoute {
  return { type: RouteType.EditModel, schemaId, modelId }
}

export function parseRoute(pathname: string, query: ParsedUrlQuery): Route {
  const isIndexPath = pathname === '/'
  if (isIndexPath) return indexRoute()

  const isSchemaPath = pathname === '/schema'
  if (!isSchemaPath) return notFoundRoute()

  const schemaId = getQsString('id', query)
  if (!schemaId) return noSchemaRoute()

  const editingSchema = getQsBoolean('editingSchema', query)
  if (editingSchema) return editSchemaRoute(schemaId)

  const modelId = getQsString('editingModel', query)
  if (modelId) return editModelRoute(schemaId, modelId)

  return viewSchemaRoute(schemaId)
}

export function routeToUrl(route: Route): string {
  switch (route.type) {
    case RouteType.NotFound:
      return '/'
    case RouteType.Index:
      return '/'
    case RouteType.NoSchema:
      return `/schema`
    case RouteType.ViewSchema:
      return `/schema?id=${route.schemaId}`
    case RouteType.EditSchema:
      return `/schema?id=${route.schemaId}&editingSchema=1`
    case RouteType.EditModel:
      return `/schema?id=${route.schemaId}&editingModel=${route.modelId}`
  }
}

export function routesMatch(a: Route, b: Route): boolean {
  return Object.entries(a as Record<string, unknown>).every(
    ([k, v]: [string, unknown]) => (b as Record<string, unknown>)[k] === v,
  )
}

export type SchemaRoute = NoSchemaRoute | ViewSchemaRoute | EditSchemaRoute | EditModelRoute
export function isSchemaRoute(route: Route): route is SchemaRoute {
  return [
    RouteType.NoSchema,
    RouteType.ViewSchema,
    RouteType.EditSchema,
    RouteType.EditModel,
  ].includes(route.type)
}
