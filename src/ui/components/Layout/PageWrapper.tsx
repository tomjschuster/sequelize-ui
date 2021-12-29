import {
  alignItems,
  backgroundColor,
  classnames,
  display,
  flexDirection,
  height,
  width,
} from '@src/ui/styles/classnames'
import React from 'react'

type Props = {
  children: React.ReactNode
}

function PageWrapper({ children }: Props): React.ReactElement {
  return (
    <div
      className={classnames(
        height('h-screen'),
        width('w-screen'),
        display('flex'),
        flexDirection('flex-col'),
        alignItems('items-stretch'),
        backgroundColor('bg-gray-50'),
      )}
    >
      {' '}
      {children}
    </div>
  )
}

export default PageWrapper
