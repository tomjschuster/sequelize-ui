const path = require('path')
const express= require('express')

module.exports = {
  app: () => {
    const app = express()
    const indexPath = path.join(__dirname, '../public/index.html')
    const publicPath = express.static(path.resolve(__dirname, '..', 'public'))
    const distPath = express.static(path.resolve(__dirname, '..', 'dist'))

    app.use(publicPath)
    app.use(distPath)
    app.get('/', (_, res) => res.sendFile(indexPath))

    return app
  }
}

