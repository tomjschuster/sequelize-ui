import type { AppProps } from 'next/app'
import React from 'react'
import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App
