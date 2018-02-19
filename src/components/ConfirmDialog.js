import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Dialog from 'react-toolbox/lib/dialog'

/* ----------  COMPONENT  ---------- */
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

export default ConfirmDialog
