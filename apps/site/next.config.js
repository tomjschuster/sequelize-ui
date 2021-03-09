const path = require('path')

const withTM = require('next-transpile-modules')([
  path.resolve(__dirname, '../../libs/core'),
  path.resolve(__dirname, '../../libs/frameworks'),
])

module.exports = withTM()
