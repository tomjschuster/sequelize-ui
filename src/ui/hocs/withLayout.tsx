import { NextPage } from 'next'
import React from 'react'
import Layout, { LayoutProps } from '../components/Layout/Layout'

type WithLayoutArg<P> = (props: P) => LayoutProps

type PageWithLayout<P, IP = P> = NextPage<P, IP> & { withLayout: WithLayoutArg<P> }

export default function withLayout<P, IP = P>(arg: (props: P) => LayoutProps) {
  return function (Page: NextPage<P, IP>): PageWithLayout<P, IP> {
    const WithLayout = Page as PageWithLayout<P, IP>
    WithLayout.withLayout = arg
    return WithLayout
  }
}

function isPageWithLayout<P>(Page: NextPage<P>): Page is PageWithLayout<P> {
  return 'withLayout' in Page && typeof (Page as PageWithLayout<P>).withLayout === 'function'
}

export function renderWithLayout<P>(Page: NextPage<P>, pageProps: P): React.ReactElement {
  return isPageWithLayout(Page) ? (
    <Layout {...Page.withLayout(pageProps)}>
      <Page {...(pageProps as P & JSX.IntrinsicAttributes)} />
    </Layout>
  ) : (
    <Page {...(pageProps as P & JSX.IntrinsicAttributes)} />
  )
}
