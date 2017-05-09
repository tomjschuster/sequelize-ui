'use strict'

import React, { Component } from 'react'
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router'
import App from './components/App'
import Main from './components/Main'
import Ace from './components/Ace'

export default class Routes extends Component {
  render() {
    return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="ace" component={Ace} />
        <IndexRoute component={Main} />
        <Redirect from="*" to="/" />
      </Route>
    </Router>
    )
  }
}
