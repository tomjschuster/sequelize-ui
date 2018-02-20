import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import {
  thunks as modelsThunks,
  actionCreators as modelsActions
} from '../../redux/models'
import {
  actionCreators as currentModelActions,
  thunks as currentModelThunks
} from '../../redux/currentModel'
import { actionCreators as uiActions } from '../../redux/ui'

/* ----------  APP COMPONENTS  ---------- */
import SingleModel from './SingleModel'

class SingleModelPage extends Component {
  componentWillMount () {
    this.props.currentModelThunks.setModel(this.props.params.id)
  }

  componentDidUpdate () {
    if (this.props.params.id !== this.props.currentModel.id) {
      this.props.currentModelThunks.setModel(this.props.params.id)
    }
  }

  createModel = () => {
    const { uiActions, modelsThunks, currentModel, models, router } = this.props
    modelsThunks
      .saveModel(currentModel, models, true)
      .then(() => router.push('/models'))
      .catch(error => uiActions.openDialog('Validation Error', error))
  }

  saveModel = () => {
    const { uiActions, modelsThunks, currentModel, models, router } = this.props
    modelsThunks
      .saveModel(currentModel, models, false)
      .then(() => router.push('/models'))
      .catch(error => uiActions.openDialog('Validation Error', error))
  }

  componentWillUnmount () {
    this.props.currentModelActions.resetModel()
  }

  render () {
    const {
      // State
      tabIdx,
      models,
      currentModel,
      fieldsToggle,
      // Actions
      uiActions,
      currentModelActions,
      modelsActions
    } = this.props
    return (
      <SingleModel
        isNew={!models.find(({ id }) => id === currentModel.id)}
        models={models}
        currentModel={currentModel}
        tabIdx={tabIdx}
        fieldsToggle={fieldsToggle}
        currentModelActions={currentModelActions}
        uiActions={uiActions}
        modelsActions={modelsActions}
        createModel={this.createModel}
        saveModel={this.saveModel}
      />
    )
  }
}

const mapStateToProps = ({ currentModel, models, ui }) => ({
  tabIdx: ui.currentModelTabIdx,
  fieldsToggle: ui.fieldsToggle,
  currentModel,
  models
})

const mapDispatchToProps = dispatch => ({
  uiActions: bindActionCreators(uiActions, dispatch),
  currentModelActions: bindActionCreators(currentModelActions, dispatch),
  modelsActions: bindActionCreators(modelsActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch),
  currentModelThunks: bindActionCreators(currentModelThunks, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleModelPage)
