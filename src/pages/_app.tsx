// import '@src/theme/cobalt2.prism.css'
import '@src/theme/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />
}

export default App
