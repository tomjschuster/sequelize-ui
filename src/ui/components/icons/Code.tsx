import React from 'react'
import { withSvg } from './Svg'

function CodeIcon(): React.ReactElement {
  return (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  )
}

export default withSvg(CodeIcon)
