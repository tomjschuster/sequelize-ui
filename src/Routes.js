import React from 'react'
import {
  Router,
  Route,
  browserHistory,
  IndexRoute,
  Redirect
} from 'react-router'
import App from './components/App'
import Main from './components/Main'

const Routes = () => (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Main} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>
)

export default Routes
