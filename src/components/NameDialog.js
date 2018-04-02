import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Modal, Button, Input } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
const NameDialog = ({
  name,
  errors,
  creatingModel,
  createModel,
  stopCreatingModel,
  inputModelName
}) =>
  <Modal open={creatingModel} basic small>
    <Modal.Content>
      <Input
        placeholder='Name your model...'
        value={name}
        error={errors.duplicateName.error && errors.duplicateName.message}
        onChange={evt => inputModelName(evt.target.value)}
      />
    </Modal.Content>
    <Modal.Actions>
      <Button icon='arrow right' onClick={createModel.bind(null, name)} />
      <Button icon='cancel' onClick={stopCreatingModel} />
    </Modal.Actions>
  </Modal>

export default NameDialog
