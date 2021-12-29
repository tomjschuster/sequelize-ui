import { classnames, display, flex, flexDirection, overflow } from '@src/ui/styles/classnames'
import React from 'react'
import Footer from './Footer'
import Header from './Header'
import Metadata, { MetadataProps } from './Metadata'
import PageWrapper from './PageWrapper'

export type LayoutProps = React.PropsWithChildren<{ compact?: boolean } & MetadataProps>

function Layout({ children, compact = false, ...metadataProps }: LayoutProps): React.ReactElement {
  return (
    <>
      <Metadata {...metadataProps} />
      <PageWrapper>
        <Header compact={compact} />
        <main
          className={classnames(
            flex('flex-1'),
            display('flex'),
            flexDirection('flex-col'),
            overflow('overflow-hidden'),
          )}
        >
          {children}
        </main>
        {!compact && <Footer />}
      </PageWrapper>
    </>
  )
}

export default Layout
