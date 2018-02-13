import React, { Component } from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import { removeModel } from '../redux/models'
import { receiveModel } from '../redux/currentModel'
import { closeDialog, closeAllFields, setCurrentModelTabIdx } from '../redux/ui'

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
      closeDialog,
      setCurrentModelTabIdx
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
          setTabIdx={setCurrentModelTabIdx}
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
  closeAllFields,
  closeDialog,
  setCurrentModelTabIdx
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
