import { void_ } from '@src/utils/functions'
import Router from 'next/router'
import { Route, routeToUrl } from './routes'

export type GoToOptions = {
  replace?: boolean
  pageLoad?: boolean
}

export async function goTo(route: Route, { replace, pageLoad }: GoToOptions = {}): Promise<void> {
  const url = routeToUrl(route)

  if (replace && pageLoad) return window.location.replace(url)
  if (pageLoad) return window.location.assign(url)
  if (replace) return void_(await Router.replace(routeToUrl(route)))
  return void_(await Router.push(routeToUrl(route)))
}
