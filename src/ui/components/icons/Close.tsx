import React from 'react'
import Svg, { SvgProps } from './Svg'

type CloseIconProps = SvgProps & {
  strokeWidth?: number
}

export default function CloseIcon({ title, strokeWidth = 2 }: CloseIconProps): React.ReactElement {
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
