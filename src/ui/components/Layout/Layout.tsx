import {
  classnames,
  display,
  flex,
  flexDirection,
  justifyContent,
  maxHeight,
  overflow,
  padding,
} from '@src/ui/styles/classnames'
import React from 'react'
import ErrorBoundary from '../ErrorBoundary'
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
            justifyContent('justify-center'),
            overflow('overflow-hidden'),
          )}
        >
          <ErrorBoundary wrapper={ErrorWrapper}>{children}</ErrorBoundary>
        </main>
        {!compact && <Footer />}
      </PageWrapper>
    </>
  )
}

function ErrorWrapper({ children }: { children?: React.ReactNode }): React.ReactElement {
  return <div className={classnames(maxHeight('max-h-full'), padding('p-4'))}>{children}</div>
}

export default Layout
