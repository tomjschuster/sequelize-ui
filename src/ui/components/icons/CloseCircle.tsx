import React from 'react'
import { withSvg } from './Svg'

function CloseCircleIcon(): React.ReactElement {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  )
}

export default withSvg(CloseCircleIcon)
