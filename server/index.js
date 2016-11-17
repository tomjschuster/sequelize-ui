'use strict';

const express = require('express'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      path = require('path'),
      chalk = require('chalk');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
   .use(morgan('dev'))
   .use(express.static(path.join(__dirname, '..', 'public')))
   .use('/materialize-css',
      express.static(path.join(__dirname, '..', 'node_modules', 'materialize-css', 'dist')))
   .use('/api', require('./api'));

const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');

app.get('*', (req, res, next) => res.sendFile(indexHtmlPath));

app.use((err, req, res, next) => {
  if (err) res.redirect('/');
})

app.listen(PORT, () =>
  console.log(chalk.italic.magenta(`Server listening on ${PORT}...`)));
