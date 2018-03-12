import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Input from 'react-toolbox/lib/input'
import { Button } from 'react-toolbox/lib/button'

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
  <div>
    <Input value={name} onChange={setModelName} label='Model Name' />
    {!isNew && <Button label='Save' primary raised onClick={saveModel} />}
    {!isNew && <Button label='Delete' raised accent onClick={removeModel} />}
    {isNew && (
      <Button
        label='Create'
        disabled={name.length === 0}
        primary
        raised
        onClick={createModel}
      />
    )}
  </div>
)

export default ModelToolBar
