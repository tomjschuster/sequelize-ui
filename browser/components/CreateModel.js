import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { times } from 'lodash';
import { addModel } from '../redux/models';
import DataTypeDropDown from './DataTypeDropDown';
import ValidationDialog from './ValidationDialog'

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {GridList, GridTile} from 'material-ui/GridList';
import Checkbox from 'material-ui/Checkbox';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

// import DropDownMenu from 'material-ui/DropDownMenu';
// import IconMenu from 'material-ui/IconMenu';
// import IconButton from 'material-ui/IconButton';
// import MenuItem from 'material-ui/MenuItem';
// import AutoComplete from 'material-ui/AutoComplete';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';
// import ContentRemove from 'material-ui/svg-icons/content/remove';
// import Subheader from 'material-ui/Subheader';
// import {List, ListItem} from 'material-ui/List';
// import Divider from 'material-ui/Divider';

const convertFields = fields => {
  let output = '';
  for (let field of fields) output += field.name + ', ';
  return output.slice(0, -2);
}

export class CreateModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {
        name: '',
        fields: [{
          name: '',
          type: '',
          unique: false,
          allowNull: true
        }]
      },
      validationDialog: {
        open: false,
        message: ''
      }
    };
    this.updateModelName = this.updateModelName.bind(this);
    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.updateField = this.updateField.bind(this);
    this.createModel = this.createModel.bind(this);
    this.closeValidationDialog = this.closeValidationDialog.bind(this);
  }

  updateModelName(evt) {
    let name = evt.target.value;
    this.setState({model: {name, fields: this.state.model.fields}});
  }

  addField() {
    let fields = [...this.state.model.fields, {name: '', type: ''}];
    let { name } = this.state.model;
    this.setState({ model: { name, fields } });
  }

  removeField(idx) {
    console.log('click');
    let fields = [...this.state.model.fields];
    fields.splice(idx, 1);
    this.setState({model: {name: this.state.model.name, fields}});
  }

  updateField(key, val, idx) {
    let fields = [...this.state.model.fields];
    fields[idx][key] = val;
    this.setState({fields});
  }

  closeValidationDialog() {
    this.setState({validationDialog: {open: false, message: ''}});
  }

  createModel() {
    let { model } = this.state;
    if (!model.name) {
      this.setState(
          {
            validationDialog: {
              open: true,
              message: 'Please give your model a name.'
            }
          }
        );
      return;
    }
    for (let field of model.fields) {
      console.log('looping');
      if (!field.name || !field.type) {
        this.setState(
          {
            validationDialog: {
              open: true,
              message: 'Every field must have a name and data type.'
            }
          }
        );
        return;
      }
    }
    this.props.addModel(model);
    this.setState({
      model: {
        name: '',
        fields: [
          {
            name: '',
            type: ''
          }
        ]
      },
      dialogOpen: false
    });
    axios.post('/api', {models: [this.state.model]});
  }

  render() {
    let { addField,
          removeField,
          updateField,
          updateModelName,
          createModel,
          closeValidationDialog } = this;
    let { open, message } = this.state.validationDialog;
    let { name,
          fields } = this.state.model;
    let { models } = this.props;
    return (
      <div>
        <div className="your-models-header">
            <h3>Your Models</h3>
            <Paper>
              { models.map((model, modelIdx) => {
                let fieldString = convertFields(model.fields);
                return (
                  <Card key={modelIdx}>
                    <CardHeader title={model.name} subtitle={`Fields: ${fieldString}`}/>
                  </Card>
                );
              })
              }
            </Paper>
        </div>
            <Paper>
              <Toolbar>
                  <ToolbarGroup firstChild={true}>
                  <ToolbarSeparator/>
                  <div className="model-name-input">
                    <TextField value={name}
                             onChange={updateModelName}
                             hintText="Model Name"/>
                  </div>
                  <ToolbarSeparator/>
                  </ToolbarGroup>
                </Toolbar>
                <div className="create-field-grid">
                <div className="create-field-header">
                  <span className="create-field-title">Fields</span>
                  <RaisedButton primary={true} label="+ ADD" onClick={addField} />
                </div>
                  <GridList>
                    { times(fields.length, fieldIdx => (
                      <GridTile key={fieldIdx}>
                        <Paper rounded={false}>
                            <TextField value={fields[fieldIdx].name}
                                       onChange={evt => updateField('name', evt.target.value, fieldIdx)}
                                       type="text" hintText="Field Name"/>
                            <DataTypeDropDown currType={fields[fieldIdx].type}
                                              idx={fieldIdx}
                                              onClick={updateField}/>
                            <Checkbox onCheck={(evt, isChecked) => updateField('unique', isChecked, fieldIdx)} label="UNIQUE" />
                            <Checkbox onCheck={(evt, isChecked) => updateField('allowNull', !isChecked, fieldIdx)} label="NOT NULL" />
                        </Paper>
                        <FlatButton label="DELETE FIELD"
                                    secondary={true}
                                    onClick={() => removeField(fieldIdx)}/>
                      </GridTile>
                    ))}
                  </GridList>
                </div>
                <Toolbar>
                  <ToolbarGroup firstChild={true}>
                  <RaisedButton label="Create Model" onClick={createModel} />
                  </ToolbarGroup>
                </Toolbar>
          </Paper>
          <ValidationDialog open={open} message={message} handleClose={closeValidationDialog}/>
        <div>
          { models.map((model, idx) => (
            <div key={idx}>
              <table>
                <thead>
                  <tr>
                    <th>{model.name}</th>
                  </tr>
                  <tr>
                    <th>Field Name</th>
                    <th>Data Type</th>
                    <th>Unique</th>
                    <th>Null</th>
                  </tr>
                </thead>
                <tbody>
                    { model.fields.map((field, idx) => (
                      <tr key={idx}>
                        <td>{field.name}</td>
                        <td>{field.type}</td>
                        <td>{field.unique ? 'Yes' : 'No'}</td>
                        <td>{field.allowNull === false ? 'No' : 'Yes'}</td>
                      </tr>
                      )) }
                </tbody>
                <tfoot>
                  <tr>
                    <td><input type="button" value="Delete Model"/></td>
                    <td><input type="button" value="Edit Model"/></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            ))}
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = dispatch => ({ addModel: model => dispatch(addModel(model))});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateModel);
