import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'react-css-themr'
import theme from './theme'
import store from './redux'
import { Router, Route } from 'react-router-dom'
import history from './history'
import App from './components/App'
import './theme/css/main.css'
import './styling/semantic.less'
// import 'semantic-ui-less/semantic.less'

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
