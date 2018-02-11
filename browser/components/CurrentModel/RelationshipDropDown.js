import React from 'react'

/*----------  LIBRARY COMPONENTS  ----------*/
import Dropdown from 'react-toolbox/lib/dropdown'

/*----------  CONSTANTS  ----------*/
const relationships = [
  { label: 'Belongs To', value: 'belongsTo' },
  { label: 'Has One', value: 'hasOne' },
  { label: 'Has Many', value: 'hasMany' },
  { label: 'Belongs To Many', value: 'belongsToMany' }
]

const RelationshipDropDown = ({ onChange, idx, value }) => (
  <Dropdown
    auto
    label="Relationship"
    source={relationships}
    value={value}
    onChange={value => onChange(value, idx)}
  />
)
export default RelationshipDropDown
