import React from 'react'
import {
  Router,
  Route,
  IndexRoute,
  browserHistory,
  Redirect
} from 'react-router'
import store from './store'
import { actionCreators as menuActions } from './redux/menu'

import MainLayout from './layout/MainLayout'
import HomePage from './pages/Home'
import ModelsPage from './pages/Models'
import SingleModelPage from './pages/SingleModel'

const Routes = () => (
  <Router history={browserHistory}>
    <Route path='/' component={MainLayout}>
      <IndexRoute component={HomePage} />
      <Route path='/models' component={ModelsPage} />
      <Route path='/models/:id' component={SingleModelPage} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>
)

browserHistory.listen(() => store.dispatch(menuActions.closeMenu()))
export default Routes
