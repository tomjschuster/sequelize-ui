const kebab = require('kebab-case')
const palette = require('../src/theme/palette')

const variables = Object.keys(palette).reduce((acc, key) => (
  Object.assign({}, acc, { [kebab(key)]: palette[key] })
), {})

module.exports = {
  plugins: {
    'postcss-cssnext': {
      features: {
        customProperties: { variables }
      }
    }
  }
}

