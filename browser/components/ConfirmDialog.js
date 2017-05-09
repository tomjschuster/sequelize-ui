'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { closeWindow } from '../redux/dialog'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

class ConfirmDialog extends Component {
  render() {
    let { open, title, message } = this.props.dialog
    let { closeWindow } = this.props
    const actions = [
      <FlatButton
        label='OK'
        secondary={true}
        keyboardFocused={true}
        onClick={closeWindow}
      />,
    ]

    return (
      <div>
        <Dialog
          title={title}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={closeWindow}>
          {message}
        </Dialog>
      </div>
    )
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ dialog }) => ({ dialog })
const mapDispatchToProps = dispatch => ({
  closeWindow: () => dispatch(closeWindow())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmDialog)
