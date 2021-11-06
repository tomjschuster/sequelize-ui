import React from 'react'
import Svg, { SvgProps } from './Svg'

// Feather icons
type FloppyDiscIconProps = SvgProps

export default function FloppyDiscIcon({ title }: FloppyDiscIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-6 w-6">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </g>
    </Svg>
  )
}
