import React from 'react'
import { withSvg } from './Svg'

function InfoIcon(): React.ReactElement {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  )
}

export default withSvg(InfoIcon)
