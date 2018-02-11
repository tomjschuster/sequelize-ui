const fs = require('fs')
const path = require('path')
const extractValues = require('modules-values-extract')

const config = variables => ({
  plugins: {
    'postcss-cssnext': {
      features: {
        customProperties: { variables }
      }
    },
    'postcss-modules-values': {}
  }
})

const cssPath = path.join(__dirname, 'browser', 'theme', 'css')
const cssFiles = fs
  .readdirSync(cssPath)
  .filter(file => file.match(/\.css/i))
  .map(file => path.resolve(path.join(cssPath, file)))

module.exports = extractValues({ files: cssFiles }).then(cssVars =>
  config(
    Object.keys(cssVars)
      .filter(key => key.match(/-/))
      .reduce((acc, key) => Object.assign({}, acc, { [key]: cssVars[key] }), {})
  )
)
