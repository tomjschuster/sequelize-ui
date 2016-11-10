import React, { Component } from 'react';
import { Router, Route, browserHistory, indexRoute } from 'react-router';
import App from './components/App';
import NotFound from './components/NotFound';

export default class Routes extends Component {
  render() {
    return (
    <Router history={browserHistory}>
      <Route path='/' component={App} />
      <Route path='*' component={NotFound} />
    </Router>
    );
  }
}
