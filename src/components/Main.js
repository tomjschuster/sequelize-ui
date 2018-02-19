import React, { Component } from 'react'
import { connect } from 'react-redux'

/* ----------  ACTION/THUNK CREATORS  ---------- */
import { saveModel, removeModel } from '../redux/models'
import {
  closeMenu,
  addMenuModel,
  updateMenuModelName,
  cancelMenuModel
} from '../redux/menu'
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
  toggleField
} from '../redux/ui'

/* ----------  APP COMPONENTS  ---------- */
import Sidebar from './Sidebar/Sidebar'
import CurrentModel from './CurrentModel/CurrentModel'
import ConfirmDialog from './ConfirmDialog'

/* ----------  COMPONENT  ---------- */
class Main extends Component {
  componentWillUnmount () {
    this.props.closeAllFields()
  }

  render () {
    const {
      models,
      menu,
      currentModel,
      ui,
      closeMenu,
      addMenuModel,
      updateMenuModelName,
      cancelMenuModel,
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
      toggleField
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
        <Sidebar
          models={models}
          menu={menu}
          currentId={currentModel.id}
          addModel={addMenuModel}
          updateModelName={updateMenuModelName}
          cancelModel={cancelMenuModel}
          saveModel={saveModel}
          active={menu.isOpen}
          removeModel={removeModel}
          receiveModel={receiveModel}
          close={closeMenu}
        />
        <ConfirmDialog dialog={ui.dialog} closeDialog={closeDialog} />
      </div>
    )
  }
}

/* ----------  CONNECT  ---------- */
const mapStateToProps = ({ models, menu, currentModel, ui }) => ({
  models,
  menu,
  currentModel,
  ui
})
const mapDispatchToProps = {
  closeMenu,
  addMenuModel,
  updateMenuModelName,
  cancelMenuModel,
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
  closeDialog
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
