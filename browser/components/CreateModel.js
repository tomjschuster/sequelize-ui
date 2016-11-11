import React, { Component } from 'react';
import { connect } from 'react-redux';
import { times } from 'lodash';
import axios from 'axios';

/*----------  ACTION/THUNK CREATORS  ----------*/
import { addModel } from '../redux/models';

/*----------  LOCAL COMPONENTS  ----------*/
import DataTypeDropDown from './DataTypeDropDown';
import ValidationDialog from './ValidationDialog'

/*----------  LIBRARY COMPONENTS  ----------*/
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

/*----------  CONSTANTS AND HELPER FUNCTIONS  ----------*/

const initialState = {
  model: {
    name: '',
    fields: [
      {
        name: '',
        type: ''
      }
    ]
  },
  dialogs: {
    modelValidation: {
      open: false,
      message: ''
    }
  }
};

const getInitialState = () => Object.assign({}, initialState);

const makeDialogState = (key, open, message) => {
  let state = {};
  state[key] = {};
  state[key].open = open;
  state[key].message = message;
  return state;
};

const messages = {
  reqModelName: 'Please give your model a name.',
  reqFieldName: 'Every field must have a name.',
  reqFieldType: 'Every field must have a data type.'
};

const convertFields = fields => {
  let output = '';
  for (let field of fields) output += field.name + ', ';
  return output.slice(0, -2);
};

/*----------  COMPONENT  ----------*/
export class CreateModel extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();

    /*----------  BIND INSTANCE METHODS  ----------*/
    this.openDialogWindow = this.openDialogWindow.bind(this);
    this.closeDialogWindow = this.closeDialogWindow.bind(this);
    this.updateModelName = this.updateModelName.bind(this);
    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.updateField = this.updateField.bind(this);
    this.createModel = this.createModel.bind(this);
  }

  openDialogWindow(key, message) {
    let dialogs = Object.assign({}, this.state.dialogs, makeDialogState(key, true, message));
    this.setState({dialogs});
  }

  closeDialogWindow(key) {
    let dialogs = Object.assign({}, this.state.dialogs, makeDialogState(key, false, ''));
    this.setState({dialogs});
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
    let fields = [...this.state.model.fields];
    fields.splice(idx, 1);
    this.setState({model: {name: this.state.model.name, fields}});
  }

  updateField(key, val, idx) {
    let fields = [...this.state.model.fields];
    fields[idx][key] = val;
    this.setState({fields});
  }

  createModel() {
    let { model } = this.state;
    if (!model.name) {
      this.openDialogWindow('modelValidation', messages.reqModelName);
      return;
    }
    for (let field of model.fields) {
      if (!field.name) {
        this.openDialogWindow('modelValidation', messages.reqFieldName);
        return;
      } else if (!field.type) {
        this.openDialogWindow('modelValidation', messages.reqFieldType);
        return;
      }
    }
    this.props.addModel(model);
    this.setState(getInitialState());
    axios.post('/api', {models: [this.state.model]});
  }

  render() {
    let { addField,
          removeField,
          updateField,
          updateModelName,
          createModel,
          closeDialogWindow } = this;
    let { model, dialogs } = this.state;
    let { models } = this.props;
    return (
      <div>
        <div className="your-models">
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
        <div className="field-definitions">
          <Paper>
            <Toolbar>
              <ToolbarGroup firstChild={true}>
              <ToolbarSeparator/>
              <div className="model-name-input">
                <TextField value={model.name}
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
                { times(model.fields.length, fieldIdx => (
                  <GridTile key={fieldIdx}>
                    <Paper rounded={false}>
                        <TextField value={model.fields[fieldIdx].name}
                                   onChange={evt => updateField('name', evt.target.value, fieldIdx)}
                                   type="text" hintText="Field Name"/>
                        <DataTypeDropDown currType={model.fields[fieldIdx].type}
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
        </div>
        <div className="dialogs">
          <ValidationDialog open={dialogs.modelValidation.open}
                            message={dialogs.modelValidation.message}
                            handleClose={() => closeDialogWindow('modelValidation')}/>
        </div>
      </div>
    );
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = dispatch => ({ addModel: model => dispatch(addModel(model))});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateModel);
