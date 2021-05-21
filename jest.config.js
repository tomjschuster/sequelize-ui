module.exports = {
  roots: ['<rootDir>/src/utils/__tests__'],
  // roots: ['<rootDir>/src', '<rootDir>/e2e/frameworks'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    'src/test-utils',
    '.*\\.d\\.ts',
    '__fixtures__',
    '__tests__',
    // write tests after completing ui
    'src/pages',
    'src/ui/components',
  ],
  moduleNameMapper: { '@src/(.*)': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['src/typings', 'src/test-utils', '__fixtures__'],
  setupFiles: ['jest-localstorage-mock'],
  resetMocks: false,
}
