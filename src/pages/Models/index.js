import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import {
  thunks as modelsThunks,
  actionCreators as modelsActions
} from '../../redux/models'
import { actionCreators as currentModelActions } from '../../redux/currentModel'
import { actionCreators as formsActions } from '../../redux/forms'
import { actionCreators as uiActions } from '../../redux/ui'
import { actionCreators as errorsActions } from '../../redux/errors'

/* ----------  APP COMPONENTS  ---------- */
import Models from './Models'

class ModelsPage extends Component {
  gotoModel = id => this.props.router.push(`/models/${id}`)

  render () {
    return (
      <Models
        currentId={this.props.currentId}
        models={this.props.models}
        creatingModel={this.props.creatingModel}
        newModelName={this.props.newModelName}
        modelsActions={this.props.modelsActions}
        gotoModel={this.gotoModel}
        errors={this.props.errors}
        formsActions={this.props.formsActions}
        uiActions={this.props.uiActions}
        errorsActions={this.props.errorsActions}
        modelsThunks={this.props.modelsThunks}
      />
    )
  }
}
const mapStateToProps = ({ currentModel, models, forms, ui, errors }) => ({
  currentId: currentModel.id,
  models,
  newModelName: forms.models.newModelName,
  creatingModel: ui.addModelState.creatingModel,
  errors: errors.models
})

const mapDispatchToProps = dispatch => ({
  currentModelActions: bindActionCreators(currentModelActions, dispatch),
  modelsActions: bindActionCreators(modelsActions, dispatch),
  formsActions: bindActionCreators(formsActions, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch),
  errorsActions: bindActionCreators(errorsActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ModelsPage)
