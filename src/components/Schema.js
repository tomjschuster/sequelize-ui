import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import {
  thunks as modelsThunks,
  actionCreators as modelsActions
} from '../redux/models'
import { actionCreators as currentModelActions } from '../redux/currentModel'
import { actionCreators as formsActions } from '../redux/forms'
import { actionCreators as uiActions } from '../redux/ui'
import { actionCreators as errorsActions } from '../redux/errors'

/* ----------  APP COMPONENTS  ---------- */
import NameDialog from './NameDialog'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button, Header, Segment } from 'semantic-ui-react'
import style from '../style/css/main.css'
/* ----------  HELPERS  ---------- */
const fieldsText = fields => {
  return `Fields: ${fields.map(({ name }) => name).join(', ')}`
}

const associationsText = (associations, modelNameObj) => {
  const targets = associations.reduce(
    (acc, assoc) =>
      acc[assoc.target]
        ? acc
        : { ...acc, [assoc.target]: modelNameObj[assoc.target] },
    {}
  )
  return `Associations: ${Object.values(targets).join(', ')}`
}

const getModelNameObj = models =>
  models.reduce((acc, m) => ({ ...acc, [m.id]: m.name }), {})

/* ----------  COMPONENT  ---------- */
const ModelItem = ({
  // State
  isCurrent,
  modelNameObj,
  model,
  // Actions
  gotoModel,
  editModel,
  removeModel
}) =>
  <Segment clearing className={style.modelItem}>
    <h3>{model.name}</h3>
    {(model.fields.length > 0 || model.associations.length > 0)
      ? (<React.Fragment>
        {model.fields.length > 0 && <p>{fieldsText(model.fields)}</p>}
        {model.associations.length > 0 && (
          <p>{associationsText(model.associations, modelNameObj)}</p>
        )}
      </React.Fragment>
      )
      : null}
    <div>
      <Button
        icon='eye'
        size='tiny'
        circular
        onClick={gotoModel}
      />
      <Button
        icon='edit'
        size='tiny'
        circular
        onClick={editModel}
      />
      <Button
        icon='trash'
        size='tiny'
        circular
        onClick={removeModel}
      />
    </div>
  </Segment>

/* ----------  Component  ---------- */

class Schema extends React.Component {
  gotoModel = id => this.props.history.push(`/schema/models/${id}`)
  editModel = id => this.props.history.push(`/schema/models/${id}/edit`)

  render () {
    const {
      history,
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
      <React.Fragment>
        <Header as='h2' icon textAlign='center'>My Schema</Header>
        <Segment.Group>
          {models.map(model => (
            <ModelItem
              key={model.id}
              isCurrent={model.id === currentId}
              modelNameObj={modelNameObj}
              model={model}
              gotoModel={() => history.push(`/schema/models/${model.id}`)}
              editModel={() => history.push(`/schema/models/${model.id}/edit`)}
              removeModel={() => modelsActions.removeModel(model.id)}
            />
          ))}
        </Segment.Group>
        <Button icon='add' onClick={uiActions.startCreatingModel} circular />
        <NameDialog
          name={newModelName}
          errors={errors}
          creatingModel={creatingModel}
          createModel={modelsThunks.createModel}
          inputModelName={formsActions.inputModelsModelName}
          stopCreatingModel={uiActions.stopCreatingModel}
        />
      </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Schema)
