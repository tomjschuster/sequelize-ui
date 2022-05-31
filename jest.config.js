const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customConfig = {
  roots: ['<rootDir>/src', '<rootDir>/e2e'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    'src/test-utils',
    '.*\\.d\\.ts',
    '__fixtures__',
    '__tests__',
    '__generated__',
    // write tests after completing ui
    'src/pages',
    'src/ui',
  ],
  moduleNameMapper: { '@src/(.*)': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['src/typings', 'src/test-utils', '__fixtures__'],
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/jestSetup.ts'],
  resetMocks: false,
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
}

const jestConfig = async () => {
  const config = await createJestConfig(customConfig)()

  const esModules = ['nanoid'].join('|')

  const transformIgnorePatterns = config.transformIgnorePatterns.map((p) =>
    p === '/node_modules/' ? `node_modules/(?!${esModules})` : p,
  )

  return { ...config, transformIgnorePatterns }
}

module.exports = jestConfig
