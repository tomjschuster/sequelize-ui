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
  lime700,
  deepOrange900,
  brown500
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
  colorPrimary: lime700,
  colorPrimaryDark: deepOrange900,
  colorAccent: brown500,
  // colorAccentDark,
  // colorPrimaryContrast,
  // colorAccentContrast
}

module.exports = customPalette
