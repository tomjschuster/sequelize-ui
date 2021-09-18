import React from 'react'
import Svg, { SvgProps } from './Svg'

type CloseCircleIconProps = SvgProps & {
  strokeWidth?: number
}

export default function CloseCircleIcon({
  title,
  strokeWidth = 2,
}: CloseCircleIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-6 w-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Svg>
  )
}
