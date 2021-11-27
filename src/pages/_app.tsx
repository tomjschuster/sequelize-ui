// import '@src/theme/cobalt2.prism.css'
import '@src/theme/globals.css'
import { AlertProvider } from '@src/ui/lib/alert'
import type { AppProps } from 'next/app'
import React from 'react'

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <AlertProvider>
      <Component {...pageProps} />
    </AlertProvider>
  )
}

export default App
