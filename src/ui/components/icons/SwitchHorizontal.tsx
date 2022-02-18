import React from 'react'
import { withSvg } from './Svg'

function SwitchHorizontalIcon(): React.ReactElement {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    />
  )
}

export default withSvg(SwitchHorizontalIcon)
