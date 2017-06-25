const {
  // Default Colors
  grey200,
  white,
  grey900,
  grey600,
  indigo500,
  indigo700,
  pinkA200,
  pink700,
  darkContrast,

  // Custom Colors
  purple500,
  purple700,
  indigoA200,
} = require('./material-design-colors')

// eslint-disable-next-line no-unused-vars
const defaultPalette = {
  colorDivider: grey200,
  colorBackground: white,
  colorText: grey900,
  colorTextSecondary: grey600,
  colorPrimary: indigo500,
  colorPrimaryDark: indigo700,
  colorAccent: pinkA200,
  colorAccentDark: pink700,
  colorPrimaryContrast: darkContrast,
  colorAccentContrast: darkContrast
}

const customPalette = {
  // colorBackground,
  // colorText,
  // colorTextSecondary,
  colorPrimary: purple500,
  colorPrimaryDark: purple700,
  colorAccent: indigoA200,
  colorAccentDark: indigo700,
  // colorPrimaryContrast,
  // colorAccentContrast
}

module.exports = customPalette
