'use strict'
const path = require('path')
const express = require('express')

const indexFileName = process.env.NODE_ENV === 'production' ?
  'index.html' : 'index.dev.html'

const PATHS = {
  public: path.resolve(__dirname, '..', 'public'),
  get index () { return path.resolve(this.public, indexFileName) }
}

module.exports = {
  app: () => {
    const app = express().use(express.static(PATHS.public))

    if (process.env.NODE_ENV !== 'production') {
      require('./dev-middleware').initialize(app)
    }

    app.get('*', (_, res) => res.sendFile(PATHS.index))

    return app
  }
}
