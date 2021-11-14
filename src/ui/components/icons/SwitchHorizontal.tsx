import React from 'react'
import Svg, { SvgProps } from './Svg'

type SwitchHorizontalIconProps = SvgProps & {
  strokeWidth?: number
}

export default function SwitchHorizontalIcon({
  title,
  strokeWidth = 1.5,
}: SwitchHorizontalIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-6 w-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </Svg>
  )
}
