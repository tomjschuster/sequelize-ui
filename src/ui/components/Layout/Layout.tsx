import {
  alignItems,
  classnames,
  display,
  flex,
  flexDirection,
  maxHeight,
  minHeight,
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
        <div
          className={classnames(
            display('flex'),
            flexDirection('flex-col'),
            alignItems('items-stretch'),
            maxHeight({ 'max-h-full': compact }),
            minHeight('min-h-full'),
          )}
        >
          <Header compact={compact} />
          <main
            className={classnames(
              flex('flex-1'),
              display('flex'),
              flexDirection('flex-col'),
              overflow('overflow-hidden'),
            )}
          >
            <ErrorBoundary wrapper={ErrorWrapper}>{children}</ErrorBoundary>
          </main>
          {!compact && <Footer />}
        </div>
      </PageWrapper>
    </>
  )
}

function ErrorWrapper({ children }: { children?: React.ReactNode }): React.ReactElement {
  return <div className={classnames(maxHeight('max-h-full'), padding('p-4'))}>{children}</div>
}

export default Layout
