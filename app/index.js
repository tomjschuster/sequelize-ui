import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import { theme } from 'theme'
import App from './components/app'

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
)

