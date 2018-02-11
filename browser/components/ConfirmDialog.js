import React from 'react'
import { connect } from 'react-redux'
import { closeWindow } from '../redux/dialog'

import Dialog from 'react-toolbox/lib/dialog'

const ConfirmDialog = ({ dialog: { open, title, message }, closeWindow }) => (
  <Dialog
    title={title}
    active={open}
    actions={[{ label: 'OK', onClick: closeWindow }]}
    onOverlayClick={closeWindow}
  >
    {message}
  </Dialog>
)

/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ dialog }) => ({ dialog })
const mapDispatchToProps = dispatch => ({
  closeWindow: () => dispatch(closeWindow())
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDialog)
