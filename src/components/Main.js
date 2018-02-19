import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
/* ----------  ACTION/THUNK CREATORS  ---------- */
import { actionCreators as modelsActions, thunks as modelsThunks } from '../redux/models'
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
      modelsActions,
      modelsThunks,
      closeMenu,
      addMenuModel,
      updateMenuModelName,
      cancelMenuModel,
      receiveModel,
      setModelName,
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
          modelsThunks={modelsThunks}
          modelsActions={modelsActions}
          setModelName={setModelName}
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
          saveModel={modelsThunks.saveModel}
          active={menu.isOpen}
          removeModel={modelsActions.removeModel}
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
const mapDispatchToProps = dispatch => ({
  modelsActions: bindActionCreators(modelsActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch),
  ...bindActionCreators({
    closeMenu,
    addMenuModel,
    updateMenuModelName,
    cancelMenuModel,
    receiveModel,
    setModelName,
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
  }, dispatch)})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
