import { ParsedUrlQuery } from 'querystring'
import {
  exampleSchemaRoute,
  indexRoute,
  notFoundRoute,
  parseRoute,
  Route,
  routesMatch,
  routeToUrl,
  schemaRoute,
} from '../routes'

describe('routes', () => {
  describe('parseRoute', () => {
    const cases: [pathname: string, query: ParsedUrlQuery, expected: Route | undefined][] = [
      ['', {}, notFoundRoute()],
      ['/', {}, indexRoute()],
      ['/', { foo: 'bar' }, indexRoute()],
      ['/schema', { id: 'foo' }, schemaRoute('foo')],
      ['/schema/foo', { id: 'foo' }, exampleSchemaRoute('foo')],
      ['/foo', {}, notFoundRoute()],
    ]

    it.each(cases)('(%s, %o) === %s', (pathname, query, expected) => {
      expect(parseRoute(pathname, query)).toEqual(expected)
    })
  })

  describe('routeToUrl', () => {
    const cases: [route: Route, expected: string][] = [
      [notFoundRoute(), '/'],
      [indexRoute(), '/'],
    ]

    it.each(cases)('(%o) === %s', (route, expected) => {
      expect(routeToUrl(route)).toEqual(expected)
    })
  })

  describe('routesMatch', () => {
    const cases: [a: Route, b: Route, expected: boolean][] = [
      [indexRoute(), indexRoute(), true],
      [notFoundRoute(), notFoundRoute(), true],
    ]

    it.each(cases)('(%o, %o) === %s', (a, b, expected) => {
      expect(routesMatch(a, b)).toEqual(expected)
    })
  })
})
