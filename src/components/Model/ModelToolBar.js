import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button, Input } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
const ModelToolBar = ({
  // State
  isNew,
  name,
  // Actions
  setModelName,
  createModel,
  saveModel,
  removeModel
}) => (
  <React.Fragment>
    <Input value={name} onChange={evt => setModelName(evt.target.value)} label='Model Name' />
    {!isNew && <Button primary onClick={saveModel}>Save</Button>}
    {!isNew && <Button onClick={removeModel}>Delete</Button>}
    {isNew && (
      <Button disabled={name.length === 0} primary onClick={createModel}>
        Create
      </Button>
    )}
  </React.Fragment>
)

export default ModelToolBar
