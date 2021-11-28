// import '@src/theme/cobalt2.prism.css'
import '@src/theme/globals.css'
import { AlertProvider } from '@src/ui/lib/alert'
import { FocusProvider } from '@src/ui/lib/focus'
import type { AppProps } from 'next/app'
import React from 'react'

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <FocusProvider>
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>
    </FocusProvider>
  )
}

export default App
