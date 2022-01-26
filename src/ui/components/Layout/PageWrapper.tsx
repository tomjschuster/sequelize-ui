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

type Props = React.PropsWithChildren<{
  compact?: boolean
}>

function PageWrapper({ compact, children }: Props): React.ReactElement {
  return (
    <div
      className={classnames(
        height({ 'h-screen': compact }),
        width({ 'w-screen': compact }),
        display('flex'),
        flexDirection('flex-col'),
        alignItems('items-stretch'),
        backgroundColor('bg-gray-50', 'dark:bg-gray-900'),
      )}
    >
      {children}
    </div>
  )
}

export default PageWrapper
