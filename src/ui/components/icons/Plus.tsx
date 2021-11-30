import React from 'react'
import { withSvg } from './Svg'

function PlusCircleIcon(): React.ReactElement {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  )
}

export default withSvg(PlusCircleIcon)
