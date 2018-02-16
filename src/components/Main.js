import React, { Component } from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import { removeModel } from '../redux/models'
import {
  receiveModel,
  addField,
  updateField,
  removeField,
  updateValidation,
  addAssociation,
  updateTarget,
  updateRelationship,
  updateAssociationConfig,
  removeAssociation
} from '../redux/currentModel'
import {
  closeDialog,
  closeAllFields,
  setCurrentModelTabIdx,
  toggleField
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
      addField,
      closeDialog,
      setCurrentModelTabIdx,
      toggleField,
      updateField,
      updateValidation,
      removeField,
      addAssociation,
      updateTarget,
      updateRelationship,
      updateAssociationConfig,
      removeAssociation
    } = this.props

    return (
      <div>
        <ModelList
          models={models}
          currentId={currentModel.id}
          removeModel={removeModel}
          receiveModel={receiveModel}
        />
        <CurrentModel
          models={models}
          currentModel={currentModel}
          tabIdx={ui.currentModelTabIdx}
          fieldsToggle={ui.fieldsToggle}
          addField={addField}
          updateField={updateField}
          updateValidation={updateValidation}
          removeField={removeField}
          addAssociation={addAssociation}
          updateTarget={updateTarget}
          updateRelationship={updateRelationship}
          updateAssociationConfig={updateAssociationConfig}
          removeAssociation={removeAssociation}
          setTabIdx={setCurrentModelTabIdx}
          toggleField={toggleField}
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
  removeModel,
  receiveModel,
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
  closeDialog,
  setCurrentModelTabIdx,
  toggleField
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
