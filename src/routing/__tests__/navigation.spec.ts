import { mockRouter } from '@src/test-utils/next'
import { goTo } from '../navigation'
import { viewSchemaRoute } from '../routes'

jest.mock('next/router', () => ({
  __esModule: true,
  default: mockRouter,
}))

describe('goTo', () => {
  it('calls Router.push with route url', () => {
    goTo(viewSchemaRoute('foo'))
    expect(mockRouter.push).toHaveBeenLastCalledWith('/schema?id=foo')
  })

  it('calls Router.replace with route url when replace is true', () => {
    goTo(viewSchemaRoute('foo'), { replace: true })
    expect(mockRouter.replace).toHaveBeenLastCalledWith('/schema?id=foo')
  })
})
