import React from 'react'

/*----------  LIBRARY COMPONENTS  ----------*/
import Dropdown from 'react-toolbox/lib/dropdown'

/*----------  COMPONENT  ----------*/
const ModelDropdown = ({ models, updateTarget, value }) => (
  <Dropdown
    auto
    label="Target Model"
    value={value}
    source={models.map(({ id, name }) => ({ value: id, label: name }))}
    onChange={updateTarget}
  />
)

export default ModelDropdown
