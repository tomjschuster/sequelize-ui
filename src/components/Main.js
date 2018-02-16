import React, { Component } from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import { removeModel } from '../redux/models'
import {
  receiveModel,
  addField,
  updateField,
  removeField,
  updateValidation
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
      removeField
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
          setTabIdx={setCurrentModelTabIdx}
          addField={addField}
          updateField={updateField}
          updateValidation={updateValidation}
          removeField={removeField}
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
  closeAllFields,
  closeDialog,
  setCurrentModelTabIdx,
  toggleField
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
