import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux'
import { Router, Route } from 'react-router-dom'
import history from './history'
import { MediaQueryProvider } from 'react-media-query-hoc'
import App from './components/App'
import 'semantic-ui-less/semantic.less'
import './style/css/main.css'

render(
  <MediaQueryProvider>
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={App} />
      </Router>
    </Provider>
  </MediaQueryProvider>,
  document.getElementById('app')
)
