'use strict'
const server = require('./server.js')
const port = (process.env.PORT || 8080)
const nodeEnv = process.env.NODE_ENV

const app = server.app()

app.listen(port, () => console.log(`Listening on ${port}... (${nodeEnv})`))

