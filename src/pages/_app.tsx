// import '@src/theme/cobalt2.prism.css'
import '@src/theme/globals.css'
// import '@src/theme/theme.prism.css'
import ErrorBoundary from '@src/ui/components/ErrorBoundary'
import { renderWithLayout } from '@src/ui/hocs/withLayout'
import { AlertProvider } from '@src/ui/lib/alert'
import { FocusProvider } from '@src/ui/lib/focus'
import type { AppProps } from 'next/app'
import React from 'react'

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <ErrorBoundary>
      <FocusProvider>
        <AlertProvider>{renderWithLayout(Component, pageProps)}</AlertProvider>
      </FocusProvider>
    </ErrorBoundary>
  )
}

export default App
