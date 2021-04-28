module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/e2e/frameworks'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    // write tests after completing ui
    'src/pages',
    'src/test-utils',
    'src/theme',
    'src/typings',
    // write tests after completing ui
    'src/ui/components',
    '__fixtures__',
    '__tests__',
  ],
  moduleNameMapper: { '@src/(.*)': '<rootDir>/src/$1' },
  testPathIgnorePatterns: [
    // write tests after completing ui
    'src/pages',
    'src/test-utils',
    'src/theme',
    'src/typings',
    // write tests after completing ui
    'src/ui/components',
    '__fixtures__',
  ],
  setupFiles: ['jest-localstorage-mock'],
  resetMocks: false,
}
