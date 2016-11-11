import React, { Component } from 'react';
import { connect } from 'react-redux';

export class App extends Component {
  render() {
    return (
      <div>
        <div id="navbar">
          <h4>Nav Bar</h4>
        </div>
        <div id="main">
          { this.props.children }
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
