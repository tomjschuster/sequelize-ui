import React from 'react'
import Svg, { SvgProps } from './Svg'

type ChevronIconProps = SvgProps & {
  strokeWidth?: number
  direction: ChevronDirection
}

export enum ChevronDirection {
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
}

export default function ChevronIcon({
  direction,
  title,
  strokeWidth = 1.5,
}: ChevronIconProps): React.ReactElement {
  return (
    <Svg title={title} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d={chevronPath(direction)}
      />
    </Svg>
  )
}

function chevronPath(direction: ChevronDirection): string {
  switch (direction) {
    case ChevronDirection.Down:
      return 'M19 9l-7 7-7-7'
    case ChevronDirection.Left:
      return 'M15 19l-7-7 7-7'
    case ChevronDirection.Right:
      return 'M9 5l7 7-7 7'
    case ChevronDirection.Up:
      return 'M5 15l7-7 7 7'
  }
}
