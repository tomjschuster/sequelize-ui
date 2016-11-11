import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './components/App';
import CreateModel from './components/CreateModel';
import NotFound from './components/NotFound';

export default class Routes extends Component {
  render() {
    return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="create" component={CreateModel}/>
        <IndexRoute to="create"/>
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
    );
  }
}
