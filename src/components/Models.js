import React, { Component, Fragment } from 'react'
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
import ModelCard from './ModelCard'
import NameDialog from './NameDialog'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button } from 'react-toolbox/lib/button'

/* ----------  HELPERS  ---------- */
const getModelNameObj = models =>
  models.reduce((acc, m) => ({ ...acc, [m.id]: m.name }), {})

/* ----------  Component  ---------- */

class Models extends Component {
  gotoModel = id => this.props.history.push(`/models/${id}`)

  render () {
    const {
      currentId,
      models,
      newModelName,
      creatingModel,
      errors,
      modelsActions,
      uiActions,
      modelsThunks,
      formsActions
    } = this.props

    const modelNameObj = getModelNameObj(models)

    return (
      <Fragment>
        <h2>Models</h2>
        <div>
          {models.map(model => (
            <ModelCard
              key={model.id}
              isCurrent={model.id === currentId}
              modelNameObj={modelNameObj}
              model={model}
              gotoModel={this.gotoModel.bind(null, model.id)}
              removeModel={modelsActions.removeModel.bind(null, model.id)}
            />
          ))}
        </div>
        <Button icon='add' onClick={uiActions.startCreatingModel} floating mini />
        <NameDialog
          name={newModelName}
          errors={errors}
          creatingModel={creatingModel}
          createModel={modelsThunks.createModel}
          inputModelName={formsActions.inputModelsModelName}
          stopCreatingModel={uiActions.stopCreatingModel}
        />
      </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Models)
