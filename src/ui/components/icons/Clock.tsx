import React from 'react'
import { withSvg } from './Svg'

function ClockIcon(): React.ReactElement {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  )
}

export default withSvg(ClockIcon)
