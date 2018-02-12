import React from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import { closeDialog } from '../redux/dialog'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import Dialog from 'react-toolbox/lib/dialog'

/*----------  COMPONENT  ----------*/
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

/*----------  CONNECT  ----------*/
const mapStateToProps = ({ dialog }) => ({ dialog })

const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(closeDialog())
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDialog)
