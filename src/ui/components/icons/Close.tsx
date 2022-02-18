import React from 'react'
import { withSvg } from './Svg'

function CloseIcon(): React.ReactElement {
  return <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
}

export default withSvg(CloseIcon)
