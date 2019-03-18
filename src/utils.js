import JSZip from 'jszip'
import Case from 'case'
import { saveAs } from 'file-saver'
import { optionKey, relationshipKey } from './constants'
import prettier from 'prettier/standalone'
import babylon from 'prettier/parser-babylon'
import * as serialize from './serialize'

const defaultConfig = { prettier: { parser: 'babylon', plugins: [babylon] } }

const zipFile = (zip, { name, content, config }) =>
  zip.file(name, prettier.format(content, config.prettier))

const formatAndCompressModels = (models, config) => {
  const zip = new JSZip()

  zipFile(zip, {
    name: '_db.js',
    content: serialize.dbFile,
    config
  })

  zipFile(zip, {
    name: 'index.js',
    content: serialize.associationFile(models),
    config
  })

  for (let x of models) {
    zipFile(zip, {
      name: `${Case.snake(x.name)}.js`,
      content: serialize.modelFile(x),
      config
    })
  }
  return zip
}

export const exportModels = (models, config = defaultConfig) =>
  formatAndCompressModels(models, config)
    .generateAsync({ type: 'blob' })
    .then(blob => saveAs(blob, 'db.zip'))

// https://stackoverflow.com/a/2117523/6122866
export const guid = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

// https://stackoverflow.com/a/6248722/6122866
export const uid = () => {
  let firstPart = (Math.random() * 46656) | 0
  let secondPart = (Math.random() * 46656) | 0
  firstPart = ('000' + firstPart.toString(36)).slice(-3)
  secondPart = ('000' + secondPart.toString(36)).slice(-3)
  return firstPart + secondPart
}
