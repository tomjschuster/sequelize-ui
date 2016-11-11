import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import ActionHome from 'material-ui/svg-icons/action/home';

export class App extends Component {
  render() {
    console.log(this.props.children);
    return (
      <div>
          <AppBar showMenuIconButton={false} />
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
