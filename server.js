const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const chalk = require('chalk')

const app = express()

const PORT = process.env.PORT || 3001

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(morgan('dev'))
  .use(express.static(path.join(__dirname, 'public')))

const indexHtmlPath = path.join(__dirname, 'public', 'index.html')

app.get('*', (req, res, next) => res.sendFile(indexHtmlPath))

app.listen(PORT, () =>
  console.log(chalk.italic.magenta(`Server listening on ${PORT}...`))
)
