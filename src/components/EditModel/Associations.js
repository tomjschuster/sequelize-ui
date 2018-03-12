import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Input from 'react-toolbox/lib/input'
import { Button } from 'react-toolbox/lib/button'
import { List, ListItem } from 'react-toolbox/lib/list'
import Dropdown from 'react-toolbox/lib/dropdown'

/* ----------  CONSTANTS  ---------- */
const relationships = [
  { label: 'Belongs To', value: 'belongsTo' },
  { label: 'Has One', value: 'hasOne' },
  { label: 'Has Many', value: 'hasMany' },
  { label: 'Belongs To Many', value: 'belongsToMany' }
]

/* ----------  COMPONENT  ---------- */
const Associations = ({
  // State
  models,
  associations,
  // Actions
  currentModelActions: {
    addAssociation,
    updateRelationship,
    updateTarget,
    updateAssociationConfig,
    removeAssociation
  }
}) => (
  <div>
    <h3>Model Associations</h3>
    <Button primary raised label='+ ADD' onClick={addAssociation} />
    <List>
      {associations.map(assoc => (
        <ListItem key={assoc.id}>
          <Dropdown
            auto
            label='Relationship'
            source={relationships}
            value={assoc.relationship}
            onChange={updateRelationship.bind(null, assoc.id)}
          />
          <Dropdown
            auto
            label='Target Model'
            value={assoc.target}
            source={models.map(({ id, name }) => ({ value: id, label: name }))}
            onChange={updateTarget.bind(null, assoc.id)}
          />
          <Input
            id='as-input'
            value={assoc.config.as || ''}
            onChange={updateAssociationConfig.bind(null, assoc.id, 'as')}
            type='text'
          />
          <span>through</span>
          <Input
            id='through-input'
            value={assoc.config.through || ''}
            onChange={updateAssociationConfig.bind(null, assoc.id, 'through')}
            type='text'
          />
          <Button
            label='DELETE'
            onClick={removeAssociation.bind(null, assoc.id)}
          />
        </ListItem>
      ))}
    </List>
  </div>
)

export default Associations
