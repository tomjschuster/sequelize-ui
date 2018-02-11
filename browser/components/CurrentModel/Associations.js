import React from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import {
  addAssociation,
  updateTarget,
  updateRelationship,
  updateAssociationConfig,
  removeAssociation
} from '../../redux/currentModel'

import RelationshipDropdown from './RelationshipDropDown'
import ModelDropdown from './ModelDropDown'

/*----------  LIBRARY COMPONENTS  ----------*/
import Input from 'react-toolbox/lib/input'
import { Button } from 'react-toolbox/lib/button'
import { List, ListItem } from 'react-toolbox/lib/list'

/*----------  COMPONENT  ----------*/
const Associations = ({
  currentModel,
  models,
  createAssociation,
  updateRelationship,
  updateTarget,
  updateAssociationConfig,
  deleteAssociation
}) => (
  <div>
    <h3>Model Associations</h3>
    <Button primary raised label="+ ADD" onClick={createAssociation} />
    <List>
      {currentModel.associations.map((association, idx) => (
        <ListItem key={idx}>
          <RelationshipDropdown
            idx={idx}
            value={currentModel.associations[idx].relationship}
            onChange={updateRelationship}
          />
          <ModelDropdown
            idx={idx}
            value={currentModel.associations[idx].target}
            models={models}
            onChange={updateTarget}
          />
          <Input
            id="as-input"
            value={currentModel.associations[idx].config.as || ''}
            onChange={value => updateAssociationConfig('as', value, idx)}
            type="text"
          />
          <span>through</span>
          <Input
            id="through-input"
            value={currentModel.associations[idx].config.through || ''}
            onChange={value => updateAssociationConfig('through', value, idx)}
            type="text"
          />
          <Button label="DELETE" onClick={() => deleteAssociation(idx)} />
        </ListItem>
      ))}
    </List>
  </div>
)

/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ currentModel, models }) => ({
  currentModel,
  models: models.models
})
const mapDispatchToProps = dispatch => ({
  createAssociation: () => dispatch(addAssociation()),
  updateTarget: (target, idx) => dispatch(updateTarget(target, idx)),
  updateRelationship: (relationship, idx) =>
    dispatch(updateRelationship(relationship, idx)),
  updateAssociationConfig: (key, val, idx) =>
    dispatch(updateAssociationConfig(key, val, idx)),
  deleteAssociation: idx => dispatch(removeAssociation(idx))
})

export default connect(mapStateToProps, mapDispatchToProps)(Associations)
