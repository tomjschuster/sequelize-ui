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
  models,
  currentModel,
  addAssociation,
  updateTarget,
  updateRelationship,
  updateAssociationConfig,
  removeAssociation
}) => (
  <div>
    <h3>Model Associations</h3>
    <Button primary raised label='+ ADD' onClick={addAssociation} />
    <List>
      {currentModel.associations.map(assoc => (
        <ListItem key={assoc.id}>
          <RelationshipDropdown
            id={assoc.id}
            value={assoc.relationship}
            updateRelationship={updateRelationship.bind(null, assoc.id)}
          />
          <ModelDropdown
            id={assoc.id}
            value={assoc.target}
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
