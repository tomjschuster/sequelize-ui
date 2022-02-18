import React from 'react'
import { withSvg } from './Svg'

type ChevronIconProps = {
  direction: ChevronDirection
}

export enum ChevronDirection {
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
}

function ChevronIcon({ direction }: ChevronIconProps): React.ReactElement {
  return <path strokeLinecap="round" strokeLinejoin="round" d={chevronPath(direction)} />
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

export default withSvg(ChevronIcon)
