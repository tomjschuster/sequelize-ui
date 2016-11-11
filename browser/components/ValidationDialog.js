import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class ValidationDialog extends Component {
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.open !== this.props.open) console.log(`before: ${prevProps.open}, after: ${this.props.open}`)
  }
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
          title="Validation Error"
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
