import { mockRouter } from '@src/test-utils/next'
import { goTo } from '../navigation'
import { indexRoute } from '../routes'

jest.mock('next/router', () => ({
  __esModule: true,
  default: mockRouter,
}))

describe('goTo', () => {
  it('calls Router.push with route url', () => {
    goTo(indexRoute())
    expect(mockRouter.push).toHaveBeenLastCalledWith('/')
  })

  it('calls Router.replace with route url when replace is true', () => {
    goTo(indexRoute(), { replace: true })
    expect(mockRouter.replace).toHaveBeenLastCalledWith('/')
  })
})
