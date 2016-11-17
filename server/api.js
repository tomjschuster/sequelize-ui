'use strict';

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const randomstring = require('randomstring');
const mkdirp = require('mkdirp');
const del = require('del');
const router = require('express').Router();
const camelCase = require('camelcase');
const utils = require('./utils');
const _db = utils.db;
const makeModelFile = utils.makeModelFile;
const makeAssociationFile = utils.makeAssociationFile;

module.exports = router;


router.get('/download/:key', function(req, res, next) {
  fs.lstat(path.join(__dirname, 'temp', req.params.key, 'db.zip'), (err, stat) => {
    if (err) {
      next(err);
    } else {
      res.type('application/zip').download(path.join(__dirname, 'temp', req.params.key, 'db.zip'),
                                           'db.zip', err => {
                                              if (err) next(err);
                                              console.log('Downloaded ', path.join(__dirname, 'temp', req.params.key, 'db.zip'));
                                            });

      del([path.join(__dirname, 'temp', req.params.key)]).then(paths => {
          console.log('Deleted files and folders:\n', paths.join('\n'));
      }).catch(next);
    }
  });
});

router.post('/create/model', (req, res, next) => {
  let key = randomstring.generate();
  mkdirp(path.join(__dirname, 'temp', `${key}`), (err) => {
    if (err) next(err);
    fs.writeFile(path.join(__dirname, 'temp', `${key}`, `${req.body.model.name}.js`),
                 makeModelFile(req.body.model),
                 err => {
                  if (err) next(err);
                  res.send(key);
                 });
  });
});

router.post('/create/db', (req, res, next) => {
  let key = randomstring.generate();
  mkdirp(path.join(__dirname, 'temp', `${key}`), (err) => {
    if (err) next(err);

    let { models } = req.body;
    let archive  = archiver('zip');
    let output = fs.createWriteStream(path.join(__dirname, 'temp', `${key}`, 'db.zip'));

    archive.pipe(output);

    archive.append(_db, { name: '_db.js'});
    models.forEach(model => archive.append(makeModelFile(model), { name: `${camelCase(model.name)}.js`}));
    archive.append(makeAssociationFile(models), { name: 'index.js'});

    archive.finalize((err, bytes) => {
      if (err) next(err);
      console.log(bytes + ' total bytes');
    });

    output.on('close', () => res.send(key));

  });
});
