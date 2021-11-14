import React from 'react'
import Svg, { SvgProps } from './Svg'

type CubeIconProps = SvgProps

export default function CubeIcon({ title }: CubeIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </Svg>
  )
}
