import React from 'react'

/* ----------  APP COMPONENTS  ---------- */
import RelationshipDropdown from './RelationshipDropDown'
import ModelDropdown from './ModelDropDown'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Input from 'react-toolbox/lib/input'
import { Button } from 'react-toolbox/lib/button'
import { List, ListItem } from 'react-toolbox/lib/list'

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
          <RelationshipDropdown
            id={assoc.id}
            relationship={assoc.relationship}
            updateRelationship={updateRelationship.bind(null, assoc.id)}
          />
          <ModelDropdown
            id={assoc.id}
            target={assoc.target}
            models={models}
            updateTarget={updateTarget.bind(null, assoc.id)}
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
