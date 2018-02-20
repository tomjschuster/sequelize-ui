import React from 'react'

/* ----------  LIBRARY COMPONENTS  ---------- */
import Dropdown from 'react-toolbox/lib/dropdown'

/* ----------  COMPONENT  ---------- */
const ModelDropdown = ({
  // State
  models,
  target,
  // Actions
  updateTarget
}) => (
  <Dropdown
    auto
    label='Target Model'
    value={target}
    source={models.map(({ id, name }) => ({ value: id, label: name }))}
    onChange={updateTarget}
  />
)

export default ModelDropdown
