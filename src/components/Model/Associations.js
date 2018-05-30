import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Input, Button, Dropdown, Card } from 'semantic-ui-react'

/* ----------  CONSTANTS  ---------- */
import { RELATIONSHIPS, displayRelationship } from '../../constants'

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
  <React.Fragment>
    <h3>Model Associations</h3>
    <Button icon='add' circular onClick={addAssociation} />
    <React.Fragment>
      {associations.map(assoc => (
        <Card key={assoc.id}>
          <Dropdown
            placeholder='Relationship'
            search
            selection
            value={assoc.relationship}
            onChange={(_, data) => updateRelationship(assoc.id, data.value)}
            options={
              Object.values(RELATIONSHIPS)
                .map(rel => ({ value: rel, text: displayRelationship(rel) }))
            }
          />
          <Dropdown
            placeholder='Target Model'
            search
            selection
            value={assoc.target}
            onChange={(_, data) => updateTarget(assoc.id, data.value)}
            options={models.map(({ id, name }) => ({ text: name, value: id }))}
          />
          <Input
            id='as-input'
            label='as'
            value={assoc.config.as || ''}
            onChange={(_, data) => updateAssociationConfig(assoc.id, 'as', data.value)}
            type='text'
          />
          <Input
            id='through-input'
            label='through'
            value={assoc.config.through || ''}
            onChange={(_, data) => updateAssociationConfig(assoc.id, 'through', data.value)}
            type='text'
          />
          <Button
            icon='delete'
            onClick={(_, data) => removeAssociation(assoc.id, data.value)}
          />
        </Card>
      ))}
    </React.Fragment>
  </React.Fragment>
)

export default Associations
