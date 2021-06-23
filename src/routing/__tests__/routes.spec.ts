import { ParsedUrlQuery } from 'querystring'
import {
  editModelRoute,
  editSchemaRoute,
  indexRoute,
  isSchemaRoute,
  noSchemaRoute,
  notFoundRoute,
  parseRoute,
  Route,
  routesMatch,
  routeToUrl,
  viewSchemaRoute,
} from '../routes'

describe('routes', () => {
  describe('parseRoute', () => {
    const cases: [pathname: string, query: ParsedUrlQuery, expected: Route | undefined][] = [
      ['', {}, notFoundRoute()],
      ['/', {}, indexRoute()],
      ['/', { foo: 'bar' }, indexRoute()],
      ['/schema', {}, noSchemaRoute()],
      ['/schema', { id: 'foo' }, viewSchemaRoute('foo')],
      ['/schema', { id: 'foo', bar: 'baz' }, viewSchemaRoute('foo')],
      ['/schema', { id: 'foo', editingSchema: '1' }, editSchemaRoute('foo')],
      ['/schema', { id: 'foo', editingSchema: '0' }, viewSchemaRoute('foo')],
      ['/schema', { id: 'foo', editingSchema: 'foo' }, viewSchemaRoute('foo')],
      ['/schema', { id: 'foo', editingModel: 'bar' }, editModelRoute('foo', 'bar')],
      ['/schema', { id: 'foo', editingModel: undefined }, viewSchemaRoute('foo')],
      ['/schema/', { id: 'foo' }, notFoundRoute()],
      ['/schema/foo', { id: 'foo' }, notFoundRoute()],
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
      [noSchemaRoute(), '/schema'],
      [viewSchemaRoute('foo'), '/schema?id=foo'],
      [editSchemaRoute('foo'), '/schema?id=foo&editingSchema=1'],
      [editModelRoute('foo', 'bar'), '/schema?id=foo&editingModel=bar'],
    ]

    it.each(cases)('(%o) === %s', (route, expected) => {
      expect(routeToUrl(route)).toEqual(expected)
    })
  })

  describe('routesMatch', () => {
    const cases: [a: Route, b: Route, expected: boolean][] = [
      [indexRoute(), indexRoute(), true],
      [indexRoute(), viewSchemaRoute('false'), false],
      [viewSchemaRoute('foo'), viewSchemaRoute('foo'), true],
      [viewSchemaRoute('foo'), viewSchemaRoute('bar'), false],
      [editSchemaRoute('foo'), editSchemaRoute('foo'), true],
      [editSchemaRoute('foo'), editSchemaRoute('bar'), false],
      [editModelRoute('foo', 'bar'), editModelRoute('foo', 'bar'), true],
      [notFoundRoute(), notFoundRoute(), true],
    ]

    it.each(cases)('(%o, %o) === %s', (a, b, expected) => {
      expect(routesMatch(a, b)).toEqual(expected)
    })
  })

  describe('isSchemaRoute', () => {
    const cases: [a: Route, expected: boolean][] = [
      [notFoundRoute(), false],
      [indexRoute(), false],
      [noSchemaRoute(), true],
      [viewSchemaRoute('foo'), true],
      [editSchemaRoute('foo'), true],
      [editModelRoute('foo', 'bar'), true],
    ]

    it.each(cases)('(%o) === %s', (route, expected) => {
      expect(isSchemaRoute(route)).toEqual(expected)
    })
  })
})
