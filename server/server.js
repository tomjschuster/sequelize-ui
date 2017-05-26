const path = require('path')
const express = require('express')

const PATHS = {
  dist: path.resolve(__dirname, '..', 'dist'),
  public: path.resolve(__dirname, '..', 'public'),
  index: path.resolve(
    __dirname, '..', 'dist', process.env.NODE_ENV === 'production' ?
      'index.html' : 'index.dev.html'
  )
}

module.exports = {
  app: () => {
    const app = express()

    app.get('/', (_, res) => res.sendFile(PATHS.index))
    app.use(express.static(PATHS.dist))
    app.use(express.static(PATHS.public))

    return app
  }
}
