'use strict'

import {
  indigo500, indigo700,
  teal400,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'
import spacing from 'material-ui/styles/spacing'

export default {
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: indigo500,
    primary2Color: indigo700,
    primary3Color: grey400,
    accent1Color: teal400,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: indigo500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
}

// .dark-primary-color    { background: #303F9F }
// .default-primary-color { background: #3F51B5 }
// .light-primary-color   { background: #C5CAE9 }
// .text-primary-color    { color: #FFFFFF }
// .accent-color          { background: #009688 }
// .primary-text-color    { color: #212121 }
// .secondary-text-color  { color: #757575 }
// .divider-color         { border-color: #BDBDBD }
