import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

/* ----------  APP COMPONENTS  ---------- */
import Schema from './Schema'
import Model from './Model'

/* ----------  COMPONENT  ---------- */

const App = () => (
  <Switch>
    <Route exact path='/:id' component={Model} />
    <Route exact path='/' component={Schema} />
    <Redirect to='/' />
  </Switch>
)

export default App
