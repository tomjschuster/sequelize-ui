'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import upperCamelCase from 'uppercamelcase';

/*----------  ACTION/THUNK CREATORS  ----------*/
import { addAssociation,
         updateTarget,
         updateRelationship,
         updateAssociationConfig,
         removeAssociation } from '../../redux/currentModel';

import { List, ListItem } from 'material-ui/List';
import RelationshipDropDown from './RelationshipDropDown';
import ModelDropDown from './ModelDropDown';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


/*----------  LIBRARY COMPONENTS  ----------*/
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import { red400 } from 'material-ui/styles/colors';

/*----------  COMPONENT  ----------*/
export class Associations extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { currentModel,
          createAssociation,
          updateRelationship,
          updateTarget,
          updateAssociationConfig,
          deleteAssociation } = this.props;
    return (
      <Paper className="associations-paper">
        <div className="associations container">
        <Subheader>Model Associations</Subheader>
        <RaisedButton primary={true} label="+ ADD" onClick={createAssociation} />
      <List>
        { currentModel.associations.map((association, idx) => (
        <ListItem key={idx} className="association-item">
          { upperCamelCase(currentModel.name) || 'MODEL' }&nbsp;
              <RelationshipDropDown idx={idx}
                                    valueKey={currentModel.associations[idx].relationship}
                                    onClick={updateRelationship}/>
              <ModelDropDown idx={idx}
                             valueKey={currentModel.associations[idx].target}
                             onClick={updateTarget}/>&nbsp;
              <TextField value={currentModel.associations[idx].config.as}
                         className="as-field"
                         onChange={evt => updateAssociationConfig('as', evt.target.value, idx)}
                         type="text"
                         hintText="as"/>&nbsp;&nbsp;&nbsp;&nbsp;
              <TextField value={currentModel.associations[idx].config.through}
                         className="through-field"
                         onChange={evt => updateAssociationConfig('through', evt.target.value, idx)}
                         type="text"
                         hintText="through"/>
              <FlatButton label="DELETE"
                          labelStyle={{ color: red400 }}
                          onClick={() => deleteAssociation(idx)}/>
        </ListItem>
          ))}
      </List>
        </div>
      </Paper>
    );
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({currentModel}) => ({currentModel});
const mapDispatchToProps = dispatch => ({
  createAssociation: () => dispatch(addAssociation()),
  updateTarget: (target, idx) => dispatch(updateTarget(target, idx)),
  updateRelationship: (relationship, idx) => dispatch(updateRelationship(relationship, idx)),
  updateAssociationConfig: (key, val, idx) => dispatch(updateAssociationConfig(key, val, idx)),
  deleteAssociation: idx => dispatch(removeAssociation(idx))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Associations);
