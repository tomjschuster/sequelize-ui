'use strict';

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class ConfirmDialog extends Component {
  render() {
    const actions = [
      <FlatButton
        label="OK"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={this.props.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}>
          {this.props.message}
        </Dialog>
      </div>
    );
  }
}
