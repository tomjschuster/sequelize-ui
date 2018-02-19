import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Input from 'react-toolbox/lib/input'
import { Button } from 'react-toolbox/lib/button'

/* ----------  COMPONENT  ---------- */
const ModelToolBar = ({
  currentModel,
  setModelName,
  createModel,
  saveModel,
  removeModel,
  isNew
}) => (
  <div>
    <Input
      value={currentModel.name}
      onChange={setModelName}
      label='Model Name'
    />
    {!isNew && <Button label='Save' primary raised onClick={saveModel} />}
    {!isNew && <Button label='Delete' raised accent onClick={removeModel} />}
    {isNew && (
      <Button
        label='Create'
        disabled={!currentModel.name}
        primary
        raised
        onClick={createModel}
      />
    )}
  </div>
)

export default ModelToolBar
