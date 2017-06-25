import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import { theme } from 'theme'
import Test from './components/Test'

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Test />
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
)

