const kebab = require('kebab-case')
const materialColors = require('../app/theme/material-design-colors')
const palette = require('../app/theme/palette')

const materialColorVars = Object.keys(materialColors).reduce((acc, key) => (
  Object.assign({}, acc, { [kebab(key)]: materialColors[key] })
), {})

const paletteVars = Object.keys(palette).reduce((acc, key) => (
  Object.assign({}, acc, { [kebab(key)]: palette[key] })
), {})

const variables = Object.assign({}, materialColorVars, paletteVars)

module.exports = {
  plugins: {
    'postcss-cssnext': {
      features: {
        customProperties: { variables }
      }
    }
  }
}

