import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Dialog from 'react-toolbox/lib/dialog'
import Input from 'react-toolbox/lib/input'

/* ----------  COMPONENT  ---------- */
const NameDialog = ({
  name,
  errors,
  creatingModel,
  createModel,
  stopCreatingModel,
  inputModelName
}) => (
  <Dialog
    title={'Create a Model'}
    active={creatingModel}
    actions={[
      { label: 'OK', onClick: createModel.bind(null, name) },
      { label: 'Cancel', onClick: stopCreatingModel }
    ]}
  >
    <Input
      value={name}
      error={errors.duplicateName.error && errors.duplicateName.message}
      onChange={inputModelName}
    />
  </Dialog>
)

export default NameDialog
