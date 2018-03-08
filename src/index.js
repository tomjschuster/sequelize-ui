import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'react-css-themr'
import theme from './theme'
import store from './store'
import Routes from './Routes'
/* eslint-disable no-unused-vars */
import css from './theme/css/main.css'
/* eslint-enable no-unused-vars */

render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Routes />
    </Provider>
  </ThemeProvider>,
  document.getElementById('app')
)
