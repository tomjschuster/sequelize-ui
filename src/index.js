import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux'
import { Router, Route } from 'react-router-dom'
import history from './history'
import App from './components/App'
import 'semantic-ui-less/semantic.less'
import './style/css/main.css'

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App} />
    </Router>
  </Provider>,
  document.getElementById('app')
)
