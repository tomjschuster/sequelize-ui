import React, { Component } from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';
import axios from 'axios';

/*----------  ACTION/THUNK CREATORS  ----------*/
import { addModel, removeModel, updateModel } from '../redux/models';

/*----------  LOCAL COMPONENTS  ----------*/
import ConfirmDialog from './ConfirmDialog';
import Field from './Field';

/*----------  LIBRARY COMPONENTS  ----------*/
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';


/*----------  ICONS  ----------*/
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';

/*----------  COLORS  ----------*/
import {grey400,
        grey200,
        grey100,
        teal200,
        teal100,
        darkBlack,
        red400,
        white,
        blueGrey200} from 'material-ui/styles/colors';


let SelectableList = makeSelectable(List);

/*----------  CONSTANTS AND HELPER FUNCTIONS  ----------*/
const trash = [];
import { getInitialModel,
         getInitialState,
         makeDialogState,
         messages,
         convertFields } from '../utils';


/*----------  COMPONENT  ----------*/
export class CreateModel extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();

    /*----------  BIND INSTANCE METHODS  ----------*/
    this.openDialogWindow = this.openDialogWindow.bind(this);
    this.closeDialogWindow = this.closeDialogWindow.bind(this);
    this.toggleFieldState = this.toggleFieldState.bind(this);
    this.updateModelName = this.updateModelName.bind(this);
    this.addField = this.addField.bind(this);
    this.updateField = this.updateField.bind(this);
    this.updateValidation = this.updateValidation.bind(this);
    this.deleteField = this.deleteField.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.updateMethod = this.updateMethod.bind(this);
    this.createModel = this.createModel.bind(this);
    this.getModel = this.getModel.bind(this);
    this.saveModel = this.saveModel.bind(this);
    this.deleteModel = this.deleteModel.bind(this);
  }


  /*----------  MANAGE DIALOG WiNDOW STATE  ----------*/
  openDialogWindow(key, title, message) {
    let dialogs = Object.assign({}, this.state.dialogs, makeDialogState(key, true, title, message));
    this.setState({dialogs});
  }

  closeDialogWindow(key) {
    let dialogs = Object.assign({}, this.state.dialogs, makeDialogState(key, false, '', ''));
    this.setState({dialogs});
  }

  /*----------  MANAGE FIELD OPEN STATE  ----------*/
  toggleFieldState(idx) {
    console.log(this.state.expandedFields);
    let expandedFields = [...this.state.expandedFields];
    expandedFields[idx] = !expandedFields[idx];
    this.setState({expandedFields});
  }

  /*----------  EDIT SELECTED MODEL  ----------*/
  updateModelName(evt) {
    let name = evt.target.value;
    let model = Object.assign({}, this.state.model, { name });
    this.setState({model});
  }

  addField() {
    let fields = [...this.state.model.fields, {name: '', type: ''}];
    let model = Object.assign({}, this.state.model, {fields});
    let expandedFields = [...this.state.expandedFields, false];
    this.setState({ model, expandedFields });
  }

  updateField(key, val, idx) {
    let fields = [...this.state.model.fields];
    fields[idx][key] = val;
    let model = Object.assign({}, this.state.model, {fields});
    this.setState({model});
  }

  updateValidation(key, val, idx) {
    let fields = [...this.state.model.fields];
    fields[idx].validate = fields[idx].validate || {};
    fields[idx].validate[key] = val;
    let model = Object.assign({}, this.state.model, {fields});
    this.setState({model});
  }

  deleteField(idx) {
    let fields = [...this.state.model.fields];
    let expandedFields = [...this.state.expandedFields];
    fields.splice(idx, 1);
    expandedFields.splice(idx, 1);
    let model = Object.assign({}, this.state.model, {fields});
    this.setState({ model, expandedFields });
  }

  updateConfig(key, val) {
    let model = Object.assign({}, this.state.model);
    model.config[key] = val;
    this.setState({model});
  }

  updateMethod(key, val) {
    let model = Object.assign({}, this.state.model);
    model.methods[key] = val;
    this.setState({model});
  }


  /*----------  VALIDATE MODEL BEFORE CREATE/SAVE  ----------*/
  validateModel(model) {
    let { models } = this.props;
    let storeModel = find(models, {name: model.name});
    if (storeModel && storeModel.id !== model.id) {
      this.openDialogWindow('confirm', 'Validation Error', messages.dupFieldName);
      return false;
    }
    if (!model.name) {
      this.openDialogWindow('confirm', 'Validation Error', messages.reqModelName);
      return false;
    }
    for (let field of model.fields) {
      if (!field.name) {
        this.openDialogWindow('confirm', 'Validation Error', messages.reqFieldName);
        return false;
      } else if (!field.type) {
        this.openDialogWindow('confirm', 'Validation Error', messages.reqFieldType);
        return false;
      }
    }
    return true;
  }

  /*----------  MODEL CRUD  ----------*/
  createModel() {
    let { model } = this.state;
    if (!this.validateModel(model)) return;
    let newModel = Object.assign({}, model);
    delete newModel.idx;
    this.props.addModel(newModel);
    this.setState({model: getInitialModel(), selectedIdx: null, expandedFields: []});
  }

  getModel(model, selectedIdx) {
    if (trash.indexOf(model) === -1) {
      this.setState({model, selectedIdx});
    }
  }

  saveModel(savedModel) {
    let { model } = this.state;
    if (!this.validateModel(model)) return;
    this.props.updateModel(savedModel);
    this.setState({model: getInitialModel(), selectedIdx: null, expandedFields: []});
  }

  deleteModel(model) {
    trash.push(model);
    this.props.removeModel(model);
    this.setState({model: getInitialModel()});
  }


  /*----------  RENDER COMPONENT  ----------*/
  render() {
    let { closeDialogWindow,
          toggleFieldState,
          updateModelName,
          addField,
          updateField,
          updateValidation,
          deleteField,
          updateConfig,
          updateMethod,
          createModel,
          getModel,
          saveModel,
          deleteModel } = this;
    let { model, dialogs, selectedIdx, expandedFields } = this.state;
    let { models } = this.props;
    return (
      <div>
        <div className="your-models">
            <div className="row">
            <div className="col s12 m6 push-m3">
              <SelectableList>
                <div>
                  <h5 className="center-align" style={{color: darkBlack}}>
                    {models.length ? 'Your Models' : 'You have no models...'}
                  </h5>
                <Subheader className="center-align">
                  {models.length ? 'Click to edit' : 'Create one below'}
                </Subheader>
                </div>
                { models.map((model, modelIdx) => {
                  let fieldString = convertFields(model.fields);
                  return (
                    <div key={modelIdx}>
                    <ListItem
                      rightIconButton={<DeleteForeverIcon onClick={() => deleteModel(model, modelIdx)}/>}
                      innerDivStyle={{
                        color: 'black',
                        backgroundColor: selectedIdx === modelIdx ? teal200 : grey200,
                        opacity: selectedIdx === modelIdx ? 0.95 : 0.85
                      }}
                      primaryText={model.name}
                      secondaryText={`Fields: ${fieldString}`}
                      secondaryTextLines={1}
                      onClick={() => getModel(model, modelIdx)}
                    />
                    <Divider inset={true} />
                    </div>
                  );
                })
                }
              </SelectableList>
              </div>
            </div>
        </div>
        <div className="field-definitions">
          <Paper>
            <Toolbar>
              <ToolbarGroup firstChild={true}>
              <ToolbarSeparator/>
              <div className="model-name-input">
                <TextField value={model.name}
                           style={{
                             fontSize: '1.5em'
                           }}
                           onChange={updateModelName}
                           hintText="Model Name"
                           hintStyle={{color: '#555'}}/>
              </div>
              <ToolbarSeparator/>
              { model.id && <RaisedButton label="Save"
                                          primary={true}
                                          onClick={() => saveModel(model)} /> }
              { model.id && <RaisedButton label="Delete"
                                          labelColor={white}
                                          backgroundColor={red400}
                                  onClick={() => deleteModel(model)} /> }
              { !model.id && <RaisedButton label="Create"
                                           disabled={!model.name}
                                           disabledBackgroundColor={blueGrey200}
                                           secondary={true}
                                           onClick={createModel} /> }
              </ToolbarGroup>
            </Toolbar>
            <Tabs>
              <Tab label="Fields">
                <div className="create-field-grid">
                  <div className="create-field-header">
                    <span className="create-field-title">Fields</span>
                    <RaisedButton primary={true} label="+ ADD" onClick={addField} />
                  </div>
                  <div className="row">
                    { model.fields.map( (field, fieldIdx) => (
                      <Field field={field}
                             idx={fieldIdx}
                             expandedFields={expandedFields}
                             updateField={updateField}
                             deleteField={deleteField}
                             toggleFieldState={toggleFieldState}
                             updateValidation={updateValidation}/>
                    ))}
                  </div>
                </div>
              </Tab>
              <Tab label="Configuration">
                <div className="configuration container">
                  <Paper>
                  <div className="container">
                  <Subheader>Table Options</Subheader>
                    <div className="row">
                      <div className="col s12 m6">
                        <TextField hintText="Table Name"
                                   value={model.config.tableName}
                                   style={{
                                           fontSize: '0.8em',
                                           width: '50%',
                                           marginTop: -5,
                                           marginBottom: -5,
                                           display: 'block',
                                           clear: 'right'
                                         }}
                                   onChange={evt =>
                                       updateConfig('tableName', evt.target.value)}/>
                        <TextField hintText="Singular Name"
                                   value={model.config.singular}
                                   style={{
                                           fontSize: '0.8em',
                                           width: '50%',
                                           marginTop: -5,
                                           marginBottom: -5,
                                           display: 'block',
                                           clear: 'right'
                                         }}
                                   onChange={evt =>
                                       updateConfig('singular', evt.target.value)}/>
                        <TextField hintText="Plural Name"
                                   value={model.config.plural}
                                   style={{
                                           fontSize: '0.8em',
                                           width: '50%',
                                           marginTop: -5,
                                           marginBottom: -5,
                                           display: 'block',
                                           clear: 'right'
                                         }}
                                   onChange={evt =>
                                       updateConfig('plural', evt.target.value)}/>
                      </div>
                      <div className="col s12 m6">
                        <Checkbox label="No Timestamp Columns"
                                  checked={!model.config.timestamps}
                                  onCheck={(evt, isChecked) =>
                                    updateConfig('timestamps', !isChecked)}/>
                        <Checkbox label="Freeze Table Names"
                                  checked={model.config.freezeTableName}
                                  onCheck={(evt, isChecked) =>
                                    updateConfig('freezeTableName', isChecked)}/>
                        <Checkbox label="Underscore Column Names"
                                  checked={model.config.underscored}
                                  onCheck={(evt, isChecked) =>
                                    updateConfig('underscored', isChecked)}/>
                        <Checkbox label="Underscore Table Names"
                                  checked={model.config.underscoredAll}
                                  onCheck={(evt, isChecked) =>
                                    updateConfig('underscoredAll', isChecked)}/>
                      </div>
                  </div>
                  <Divider inset={true} />
                  <Subheader>Include Templates For:</Subheader>
                  <Checkbox label="Hooks"
                            checked={model.methods.hooks}
                            onCheck={(evt, isChecked) =>
                              updateMethod('hooks', isChecked)}/>
                  <Checkbox label="Getter Methods"
                            checked={model.methods.getterMethods}
                            onCheck={(evt, isChecked) =>
                              updateMethod('getterMethods', isChecked)}/>
                  <Checkbox label="Setter Methods"
                            checked={model.methods.setterMethods}
                            onCheck={(evt, isChecked) =>
                              updateMethod('setterMethods', isChecked)}/>
                  <Checkbox label="Instance Methods"
                            checked={model.methods.instanceMethods}
                            onCheck={(evt, isChecked) =>
                              updateMethod('instanceMethods', isChecked)}/>
                  <Checkbox label="Class Methods"
                            checked={model.methods.classMethods}
                            onCheck={(evt, isChecked) =>
                              updateMethod('classMethods', isChecked)}/>
                  </div>
                  </Paper>
                </div>
              </Tab>
            </Tabs>
          </Paper>
        </div>
        <div className="dialogs">
          <ConfirmDialog open={dialogs.confirm.open}
                         title={dialogs.confirm.title}
                         message={dialogs.confirm.message}
                         handleClose={() => closeDialogWindow('confirm')}/>
        </div>
      </div>
    );
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = dispatch => ({
  addModel: model => dispatch(addModel(model)),
  removeModel: (model) => dispatch(removeModel(model)),
  updateModel: (model) => dispatch(updateModel(model))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateModel);
