import React, { Component } from 'react';
import { connect } from 'react-redux';

export class NotFound extends Component {
  render() {
    return (
      <h3>404 Not Found</h3>
    );
  }
}


const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotFound);
