import React from 'react'
import Svg, { SvgProps } from './Svg'

type FilmIconProps = SvgProps & {
  strokeWidth?: number
}

export default function FilmIcon({ title, strokeWidth = 1.5 }: FilmIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-6 w-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </Svg>
  )
}
