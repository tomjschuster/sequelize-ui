module.exports = {
  roots: [
    '<rootDir>/src/api',
    '<rootDir>/src/core',
    '<rootDir>/src/data',
    '<rootDir>/src/io',
    '<rootDir>/integration/frameworks',
  ],
  moduleNameMapper: { '@src/(.*)': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['<rootDir>/.buildcache', '<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFiles: ['jest-localstorage-mock'],
  resetMocks: false,
}
