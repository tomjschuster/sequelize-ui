module.exports = {
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
    'src/ui/components',
    'src/ui/classnames',
    'src/ui/utils',
  ],
  moduleNameMapper: { '@src/(.*)': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['src/typings', 'src/test-utils', '__fixtures__'],
  setupFiles: ['jest-localstorage-mock'],
  resetMocks: false,
}
