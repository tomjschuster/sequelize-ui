import React, { Component } from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import { saveModel, removeModel } from '../redux/models'
import {
  receiveModel,
  setModelName,
  addField,
  updateField,
  removeField,
  updateValidation,
  addAssociation,
  updateTarget,
  updateRelationship,
  updateAssociationConfig,
  removeAssociation,
  updateConfig,
  updateMethod
} from '../redux/currentModel'
import {
  closeDialog,
  closeAllFields,
  setCurrentModelTabIdx,
  toggleField,
  closeModelsList
} from '../redux/ui'

/*----------  APP COMPONENTS  ----------*/
import ModelList from './ModelList/ModelList'
import CurrentModel from './CurrentModel/CurrentModel'
import ConfirmDialog from './ConfirmDialog'

/*----------  COMPONENT  ----------*/
class Main extends Component {
  componentWillUnmount() {
    this.props.closeAllFields()
  }

  render() {
    const {
      models,
      currentModel,
      ui,
      receiveModel,
      removeModel,
      setModelName,
      saveModel,
      addField,
      closeDialog,
      updateField,
      updateValidation,
      removeField,
      addAssociation,
      updateTarget,
      updateRelationship,
      updateAssociationConfig,
      removeAssociation,
      updateConfig,
      updateMethod,
      setCurrentModelTabIdx,
      toggleField,
      closeModelsList
    } = this.props

    return (
      <div>
        <CurrentModel
          models={models}
          currentModel={currentModel}
          tabIdx={ui.currentModelTabIdx}
          fieldsToggle={ui.fieldsToggle}
          setModelName={setModelName}
          saveModel={saveModel}
          removeModel={removeModel}
          addField={addField}
          updateField={updateField}
          updateValidation={updateValidation}
          removeField={removeField}
          addAssociation={addAssociation}
          updateTarget={updateTarget}
          updateRelationship={updateRelationship}
          updateAssociationConfig={updateAssociationConfig}
          removeAssociation={removeAssociation}
          updateConfig={updateConfig}
          updateMethod={updateMethod}
          setTabIdx={setCurrentModelTabIdx}
          toggleField={toggleField}
        />
        <ModelList
          models={models}
          currentId={currentModel.id}
          active={ui.modelsListIsOpen}
          removeModel={removeModel}
          receiveModel={receiveModel}
          close={closeModelsList}
        />
        <ConfirmDialog dialog={ui.dialog} closeDialog={closeDialog} />
      </div>
    )
  }
}

/*----------  CONNECT  ----------*/
const mapStateToProps = ({ models, currentModel, ui }) => ({
  models,
  currentModel,
  ui
})
const mapDispatchToProps = {
  receiveModel,
  removeModel,
  setModelName,
  saveModel,
  addField,
  updateField,
  updateValidation,
  removeField,
  addAssociation,
  updateTarget,
  updateRelationship,
  updateAssociationConfig,
  removeAssociation,
  closeAllFields,
  updateConfig,
  updateMethod,
  setCurrentModelTabIdx,
  toggleField,
  closeDialog,
  closeModelsList
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
