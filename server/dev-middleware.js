const initialize = app => {
  const webpack = require('webpack')
  const config = require('../config/webpack.dev.config.js')
  const compiler = webpack(config)
  const devMiddlewareConfig = {
    noInfo: true,
    publicPath: config.output.publicPath
  }

  app.use(require('webpack-hot-middleware')(compiler))
  app.use(require('webpack-dev-middleware')(compiler, devMiddlewareConfig))
}

module.exports = { initialize }
