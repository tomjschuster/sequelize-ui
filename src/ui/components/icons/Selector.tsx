import React from 'react'
import { withSvg } from './Svg'

function SelectorIcon(): React.ReactElement {
  return <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
}

export default withSvg(SelectorIcon)
