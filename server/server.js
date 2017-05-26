const path = require('path')
const express = require('express')

module.exports = {
  app: () => {
    const app = express()
    const distPath = path.resolve(__dirname, '..', 'dist')
    const publicPath = path.resolve(__dirname, '..', 'public')
    const indexPath = path.join(distPath, 'index.html')

    app.use(express.static(distPath))
    app.use(express.static(publicPath))
    app.get('/', (_, res) => res.sendFile(indexPath))

    return app
  }
}

