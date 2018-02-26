import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'react-css-themr'
import theme from './theme'
import store from './store'
import Routes from './Routes'
import css from '../assets/main.css'

render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Routes />
    </Provider>
  </ThemeProvider>,
  document.getElementById('app')
)
