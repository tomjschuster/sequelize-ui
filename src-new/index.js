import React from 'react'
import { render } from 'react-dom'
import { MediaQueryProvider } from 'react-media-query-hoc'
import App from './App.jsx'

const customQueries = {
  smallScreen: 'screen and (max-width: 740px)',
  tinyScreen: 'screen and (max-width: 550px)'
}

render(
  <MediaQueryProvider queries={customQueries}>
    <App />
  </MediaQueryProvider>,
  document.getElementById('app')
)
