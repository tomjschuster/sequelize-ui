import React from 'react'
import { render } from 'react-dom'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import { theme } from 'theme'
import App from './components/app'

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('app')
  )

