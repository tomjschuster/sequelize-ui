import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import MainLayout from './layout/MainLayout'
import HomePage from './pages/Home'
import ModelsPage from './pages/Models'
import SingleModelPage from './pages/SingleModel'

const Routes = () => (
  <Router>
    <MainLayout>
      <Switch>
        <Route path='/models/:id' component={SingleModelPage} />
        <Route path='/models' component={ModelsPage} />
        <Route path='/' component={HomePage} />
        <Redirect to='/' />
      </Switch>
    </MainLayout>
  </Router>
)

export default Routes
