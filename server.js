const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const chalk = require('chalk')

const app = express()

const PORT = process.env.PORT || 3001
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0'

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(morgan('dev'))
  .use(express.static(path.join(__dirname, 'dist')))

const indexHtmlPath = path.join(__dirname, 'dist', 'index.html')

app.get('*', (req, res, next) => res.sendFile(indexHtmlPath))

app.listen(PORT, HOSTNAME, () =>
  console.log(chalk.italic.magenta(`Server listening on ${PORT}...`))
)
