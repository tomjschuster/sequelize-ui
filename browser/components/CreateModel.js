'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';

/*----------  ACTION/THUNK CREATORS  ----------*/
import { addModel, removeModel, updateModel } from '../redux/models';

/*----------  LOCAL COMPONENTS  ----------*/
import ConfirmDialog from './ConfirmDialog';
import ModelBuilder from './ModelBuilder';
import ModelList from './ModelList';

/*----------  CONSTANTS AND HELPER FUNCTIONS  ----------*/
const trash = [];
import { getInitialModel,
         getInitialState,
         makeDialogState,
         messages } from '../utils';


/*----------  COMPONENT  ----------*/
export class CreateModel extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();

    /*----------  BIND INSTANCE METHODS  ----------*/
    this.setTabIdx = this.setTabIdx.bind(this);
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

  /*----------  MANAGE TAB STATE  ----------*/
  setTabIdx(tabIdx) {
    this.setState({tabIdx});
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
    let { setTabIdx,
          closeDialogWindow,
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
    let { tabIdx, model, dialogs, selectedIdx, expandedFields } = this.state;
    let { models } = this.props;
    return (
      <div>
        <div className="your-models">
          <div className="row">
            <div className="col s12 m6 push-m3">
              <ModelList models={models}
                         selectedIdx={selectedIdx}
                         getModel={getModel}
                         deleteModel={deleteModel}/>
            </div>
          </div>
        </div>
        <div className="field-definitions">
          <ModelBuilder tabIdx={tabIdx}
                        model={model}
                        expandedFields={expandedFields}
                        setTabIdx={setTabIdx}
                        toggleFieldState={toggleFieldState}
                        updateModelName={updateModelName}
                        addField={addField}
                        updateField={updateField}
                        updateValidation={updateValidation}
                        deleteField={deleteField}
                        updateConfig={updateConfig}
                        updateMethod={updateMethod}
                        createModel={createModel}
                        saveModel={saveModel}
                        deleteModel={deleteModel}/>

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
