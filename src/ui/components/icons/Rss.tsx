import React from 'react'
import Svg, { SvgProps } from './Svg'

type RssIconProps = SvgProps & {
  strokeWidth?: number
}

export default function RssIcon({ title, strokeWidth = 2 }: RssIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-6 w-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
      />
    </Svg>
  )
}
