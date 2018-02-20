import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION CREATORS / THUNKS  ---------- */
import { actionCreators as uiActions } from '../redux/ui'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Dialog from 'react-toolbox/lib/dialog'

/* ----------  COMPONENT  ---------- */
const ErrorDialog = ({ dialog: { open, title, message }, closeDialog }) => (
  <Dialog
    title={title}
    active={open}
    actions={[{ label: 'OK', onClick: closeDialog }]}
    onOverlayClick={closeDialog}
  >
    {message}
  </Dialog>
)

const mapStateToProps = ({ ui: { dialog } }) => ({ dialog })

const mapDispatchToProps = { closeDialog: uiActions.closeDialog }

export default connect(mapStateToProps, mapDispatchToProps)(ErrorDialog)
