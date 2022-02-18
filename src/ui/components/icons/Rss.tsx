import React from 'react'
import { withSvg } from './Svg'

function RssIcon(): React.ReactElement {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
    />
  )
}

export default withSvg(RssIcon)
