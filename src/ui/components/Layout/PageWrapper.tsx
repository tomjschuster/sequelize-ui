import { classnames, height, width } from '@src/ui/styles/classnames'
import React from 'react'

type Props = {
  children: React.ReactNode
}

function PageWrapper({ children }: Props): React.ReactElement {
  return <div className={classnames(height('h-screen'), width('w-screen'))}>{children}</div>
}

export default PageWrapper
