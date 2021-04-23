module.exports = {
  roots: ['<rootDir>/src/core', '<rootDir>/integration/frameworks'],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.buildcache', '<rootDir>/.next/', '<rootDir>/node_modules/'],
}
