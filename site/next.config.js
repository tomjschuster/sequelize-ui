const path = require('path')

const withTM = require('next-transpile-modules')(
  // All of the libs will resolve to our monorepo so we can match that path.
  [path.resolve(__dirname, '../libs/core'), path.resolve(__dirname, '../libs/frameworks')],
)

// Set target for compatibility with Vercel/Now deployments:
// Source: https://github.com/vercel/vercel/blob/master/errors/now-next-no-serverless-pages-built.md
module.exports = withTM({})
