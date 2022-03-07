const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const jestConfig = {
  roots: ['<rootDir>/src', '<rootDir>/e2e/frameworks'],
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
  resetMocks: false,
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(jestConfig)
