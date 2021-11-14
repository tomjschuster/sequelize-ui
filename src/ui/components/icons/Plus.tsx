import React from 'react'
import Svg, { SvgProps } from './Svg'

type PlusCircleIconProps = SvgProps & {
  strokeWidth?: number
}

export default function PlusCircleIcon({
  title,
  strokeWidth = 1.5,
}: PlusCircleIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-6 w-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Svg>
  )
}
