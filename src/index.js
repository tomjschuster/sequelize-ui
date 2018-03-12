import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'react-css-themr'
import theme from './theme'
import store from './redux'
import { Router, Route } from 'react-router-dom'
import history from './history'
import App from './components/App'
/* eslint-disable no-unused-vars */
import css from './theme/css/main.css'
/* eslint-enable no-unused-vars */

render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={App} />
      </Router>
    </Provider>
  </ThemeProvider>,
  document.getElementById('app')
)
