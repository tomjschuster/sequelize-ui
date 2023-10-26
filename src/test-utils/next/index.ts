import { MittEmitter } from 'next/dist/shared/lib/mitt'
import { NextRouter } from 'next/router'

export const mockRouterEvents: MittEmitter<unknown> = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
}

export const mockRouter: NextRouter = {
  route: '',
  pathname: '',
  asPath: '',
  basePath: '',
  isLocaleDomain: false,
  query: {},
  isFallback: false,
  isReady: false,
  isPreview: false,
  forward: jest.fn(),
  beforePopState: jest.fn(),
  events: mockRouterEvents,
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(() => Promise.resolve()),
}
