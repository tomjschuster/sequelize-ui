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
    const app = express()

    app.get('/', (_, res) => res.sendFile(PATHS.index))
    app.use(express.static(PATHS.public))

    return app
  }
}
