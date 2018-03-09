import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'react-css-themr'
import theme from './theme'
import store from './redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './components/App'
/* eslint-disable no-unused-vars */
import css from './theme/css/main.css'
/* eslint-enable no-unused-vars */

render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <Route path='/' component={App} />
      </Router>
    </Provider>
  </ThemeProvider>,
  document.getElementById('app')
)
