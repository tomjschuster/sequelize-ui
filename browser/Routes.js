import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import App from './components/App';
import CreateModel from './components/CreateModel';

export default class Routes extends Component {
  render() {
    return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={CreateModel}/>
        <Redirect from="*" to="/"/>
      </Route>
    </Router>
    );
  }
}
