import React from 'react'
import Svg, { SvgProps } from './Svg'

type CollectionIconProps = SvgProps & {
  strokeWidth?: number
}

export default function CollectionIcon({
  title,
  strokeWidth = 1.5,
}: CollectionIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-3 w-3">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </Svg>
  )
}
