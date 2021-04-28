import Router from 'next/router'
import { Route, routeToUrl } from './routes'

type GoToOptions = {
  replace?: boolean
}

export function goTo(route: Route, options: GoToOptions = {}): Promise<boolean> {
  return options.replace ? Router.replace(routeToUrl(route)) : Router.push(routeToUrl(route))
}
