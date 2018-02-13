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

/*----------  APP COMPONENTS  ----------*/
import RelationshipDropdown from './RelationshipDropDown'
import ModelDropdown from './ModelDropDown'

/*----------  UI LIBRARY COMPONENTS  ----------*/
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
      {currentModel.associations.map(assoc => (
        <ListItem key={assoc.id}>
          <RelationshipDropdown
            id={assoc.id}
            value={assoc.relationship}
            onChange={updateRelationship}
          />
          <ModelDropdown
            id={assoc.id}
            value={assoc.target}
            models={models}
            onChange={updateTarget}
          />
          <Input
            id="as-input"
            value={assoc.config.as || ''}
            onChange={value => updateAssociationConfig('as', value, assoc.id)}
            type="text"
          />
          <span>through</span>
          <Input
            id="through-input"
            value={assoc.config.through || ''}
            onChange={value =>
              updateAssociationConfig('through', value, assoc.id)
            }
            type="text"
          />
          <Button label="DELETE" onClick={() => deleteAssociation(assoc.id)} />
        </ListItem>
      ))}
    </List>
  </div>
)

/*----------  CONNECT  ----------*/
const mapStateToProps = ({ currentModel, models }) => ({ currentModel, models })

const mapDispatchToProps = dispatch => ({
  createAssociation: () => dispatch(addAssociation()),
  updateTarget: (target, id) => dispatch(updateTarget(target, id)),
  updateRelationship: (relationship, id) =>
    dispatch(updateRelationship(relationship, id)),
  updateAssociationConfig: (key, val, id) =>
    dispatch(updateAssociationConfig(key, val, id)),
  deleteAssociation: id => dispatch(removeAssociation(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Associations)
