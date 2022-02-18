import React from 'react'
import { withSvg } from './Svg'

function ArrowIcon(): React.ReactElement {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
    />
  )
}

export default withSvg(ArrowIcon)
