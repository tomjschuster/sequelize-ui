import React from 'react'
import Svg, { SvgProps } from './Svg'

type SelectorIconProps = SvgProps

export default function SelectorIcon({ title }: SelectorIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-6 w-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
      />
    </Svg>
  )
}
