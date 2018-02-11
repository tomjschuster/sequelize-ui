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
import Ace from './components/Ace'

const Routes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="ace" component={Ace} />
      <IndexRoute component={Main} />
      <Redirect from="*" to="/" />
    </Route>
  </Router>
)

export default Routes
