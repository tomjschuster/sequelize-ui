import { backgroundColor, classnames, height, width } from '@src/ui/styles/classnames'
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
        backgroundColor('bg-gray-50', 'dark:bg-gray-900'),
      )}
    >
      {children}
    </div>
  )
}

export default PageWrapper
