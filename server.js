const express = require('express')
const path = require('path')

const app = express()

const PORT = process.env.PORT || 3001
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0'

app.use(express.static(path.join(__dirname, 'dist')))

const indexHtmlPath = path.join(__dirname, 'dist', 'index.html')

app.get('*', (req, res, next) => res.sendFile(indexHtmlPath))

app.listen(PORT, HOSTNAME, () => console.log(`Server listening on ${PORT}...`))
