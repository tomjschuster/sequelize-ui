import React from 'react'
import Svg, { SvgProps } from './Svg'

type ClockIconProps = SvgProps & {
  strokeWidth?: number
}

export default function ClockIcon({ title, strokeWidth = 2 }: ClockIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-3 w-3">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Svg>
  )
}
