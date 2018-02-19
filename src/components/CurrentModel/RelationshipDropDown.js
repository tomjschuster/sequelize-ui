import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Dropdown from 'react-toolbox/lib/dropdown'

/* ----------  CONSTANTS  ---------- */
const relationships = [
  { label: 'Belongs To', value: 'belongsTo' },
  { label: 'Has One', value: 'hasOne' },
  { label: 'Has Many', value: 'hasMany' },
  { label: 'Belongs To Many', value: 'belongsToMany' }
]

/* ----------  COMPONENT  ---------- */
const RelationshipDropDown = ({ updateRelationship, value }) => (
  <Dropdown
    auto
    label='Relationship'
    source={relationships}
    value={value}
    onChange={updateRelationship}
  />
)
export default RelationshipDropDown
