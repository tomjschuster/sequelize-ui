module.exports = {
  roots: [
    '<rootDir>/src/api',
    '<rootDir>/src/core',
    '<rootDir>/src/data',
    '<rootDir>/src/frameworks',
    '<rootDir>/src/io',
    '<rootDir>/src/routing',
    '<rootDir>/integration/frameworks',
  ],
  moduleNameMapper: { '@src/(.*)': '<rootDir>/src/$1' },
  testPathIgnorePatterns: [
    '<rootDir>/.buildcache',
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '__fixtures__',
  ],
  setupFiles: ['jest-localstorage-mock'],
  resetMocks: false,
}
