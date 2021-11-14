import React from 'react'
import Svg, { SvgProps } from './Svg'

type CloseIconProps = SvgProps & {
  strokeWidth?: number
  size?: Size
}

type Size = 1 | 2 | 3 | 4 | 5 | 6

export default function CloseIcon({
  title,
  size = 6,
  strokeWidth = 1.5,
}: CloseIconProps): React.ReactElement {
  return (
    <Svg title={title} className={`h-${size} w-${size}`}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 18L18 6M6 6l12 12"
      />
    </Svg>
  )
}
