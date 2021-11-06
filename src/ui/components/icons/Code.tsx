import React from 'react'
import Svg, { SvgProps } from './Svg'

type CodeIconProps = SvgProps

export default function CodeIcon({ title }: CodeIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-6 w-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </Svg>
  )
}
