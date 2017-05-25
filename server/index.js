const server = require('./server.js')
const port = (process.env.PORT || 8080)
const app = server.app()

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'prod') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.dev.config.js')
  const compiler = webpack(config)
  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
}

app.listen(port, () => console.log(`Listening on ${port}...`))

