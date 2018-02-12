import React from 'react'
import { connect } from 'react-redux'
import { closeDialog } from '../redux/dialog'

import Dialog from 'react-toolbox/lib/dialog'

const ConfirmDialog = ({ dialog: { open, title, message }, closeDialog }) => (
  <Dialog
    title={title}
    active={open}
    actions={[{ label: 'OK', onClick: closeDialog }]}
    onOverlayClick={closeDialog}
  >
    {message}
  </Dialog>
)

/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ dialog }) => ({ dialog })
const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(closeDialog())
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDialog)
