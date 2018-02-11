const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const randomstring = require('randomstring')
const mkdirp = require('mkdirp')
const del = require('del')
const camelCase = require('camelcase')
const { _db, makeModelFile, makeAssociationFile } = require('./utils')

const router = (module.exports = require('express').Router())

router.get('/download/:key', function(req, res, next) {
  let folderPath = path.join(__dirname, 'temp', req.params.key)
  let filePath = path.join(__dirname, 'temp', req.params.key, 'db.zip')
  fs.lstat(filePath, (err, stat) => {
    if (err) {
      next(err)
    } else {
      res.type('application/zip').download(filePath, 'db.zip', err => {
        if (err) next(err)
        console.log(`Downloaded ${filePath}`)
      })

      del([folderPath])
        .then(paths => {
          console.log(`Deleted files and folders:\n ${paths.join('\n')}`)
        })
        .catch(next)
    }
  })
})

router.post('/create/db', (req, res, next) => {
  let key = randomstring.generate()
  let folderPath = path.join(__dirname, 'temp', `${key}`)
  let filePath = path.join(folderPath, 'db.zip')

  mkdirp(folderPath, err => {
    if (err) next(err)

    let models = req.body.models
    let archive = archiver('zip')
    let output = fs.createWriteStream(filePath)

    archive.pipe(output)

    archive.append(_db, { name: '_db.js' })
    models.forEach(model =>
      archive.append(makeModelFile(model), {
        name: `${camelCase(model.name)}.js`
      })
    )
    archive.append(makeAssociationFile(models), { name: 'index.js' })

    archive.finalize((err, bytes) => {
      if (err) next(err)
      console.log(bytes + ' total bytes')
    })

    output.on('close', () => res.send(key))
  })
})
