import { editSchemaRoute, indexRoute, notFoundRoute } from '@src/routing/routes'
import { mockRouter } from '@src/test-utils/next'
import { renderHook } from '@testing-library/react-hooks'
import { NextRouter, useRouter } from 'next/router'
import useRoute, { UseRouteResult } from '../useRoute'

jest.mock('next/router', () => ({
  useRouter: jest.fn((): NextRouter => mockRouter),
}))

describe('useRoute', () => {
  const cases: [router: Partial<NextRouter>, expected: UseRouteResult][] = [
    [
      { isReady: false, pathname: '/', query: {} },
      { loading: true, route: undefined },
    ],
    [
      { isReady: true, pathname: '/', query: {} },
      { loading: false, route: indexRoute() },
    ],
    [
      { isReady: true, pathname: '/schema', query: { id: 'foo', editingSchema: '1' } },
      { loading: false, route: editSchemaRoute('foo') },
    ],
    [
      { isReady: true, pathname: '/foo', query: {} },
      { loading: false, route: notFoundRoute() },
    ],
  ]
  it.each(cases)('when router is %o, useQuery() === %o', (router, expected) => {
    ;(useRouter as jest.Mock).mockReturnValueOnce({ ...mockRouter, ...router })
    const { result } = renderHook(useRoute)
    expect(result.current).toEqual(expected)
  })
})
