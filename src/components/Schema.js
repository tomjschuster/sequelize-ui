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

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button, Input, Container, Card, Divider } from 'semantic-ui-react'
import style from '../style/css/main.css'

/* ----------  HELPERS  ---------- */

/* ----------  COMPONENT  ---------- */

const ModelCard = ({
  // State
  isCurrent,
  modelNameObj,
  model,
  // Actions
  gotoModel,
  editModel,
  removeModel
}) =>
  <Card clearing className={style.modelCard}>
    <Card.Content>
      <div className={style.modelCardHeaderContainer}>
        <Card.Header as='h3' content={model.name} clas />
      </div>
      <div className={style.modelCardButtons}>
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
    </Card.Content>
  </Card>

/* ----------  Component  ---------- */

class Schema extends React.Component {
  constructor (props) {
    super(props)
    this.nameInput = React.createRef()
    this.addModelButton = React.createRef()
  }

  gotoModel = id => this.props.history.push(`/${id}`)
  editModel = id => this.props.history.push(`/${id}/edit`)

  focusOnNameInput = () => this.nameInput.current.focus()
  focusOnAddModelButton = () => this.addModelButton.current.focus()

  componentDidMount () {
    this.focusOnAddModelButton()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.creatingModel && this.props.creatingModel) {
      this.focusOnNameInput()
    }

    if (prevProps.creatingModel && !this.props.creatingModel) {
      this.focusOnAddModelButton()
    }
  }

  render () {
    const {
      history,
      currentId,
      models,
      newModelName,
      creatingModel,
      // errors,
      modelsActions,
      uiActions,
      modelsThunks: { createModel },
      formsActions: { inputModelsModelName }
    } = this.props

    return (
      <React.Fragment>
        <Container textAlign='center'>
          {creatingModel
            ? (
              <Input
                ref={this.nameInput}
                placeholder='Name your model...'
                value={newModelName}
                onChange={evt => inputModelsModelName(evt.target.value)}
                onKeyPress={evt => evt.key === 'Enter' && createModel(newModelName)}
                action
              >
                <input />
                <Button
                  onClick={() => createModel(newModelName)}
                >
                  Create
                </Button>
                <Button
                  onClick={() => uiActions.stopCreatingModel()}
                >
                  Cancel
                </Button>
              </Input>
            )
            : (
              <Button
                ref={this.addModelButton}
                onClick={uiActions.startCreatingModel}
                className={style.createModelBtn}
              >
              Create a Model
              </Button>
            )
          }
        </Container>
        <Divider />
        <Card.Group>
          {models.map(model => (
            <ModelCard
              key={model.id}
              isCurrent={model.id === currentId}
              model={model}
              gotoModel={() => history.push(`/${model.id}`)}
              editModel={() => history.push(`/${model.id}/edit`)}
              removeModel={() => modelsActions.removeModel(model.id)}
            />
          ))}
        </Card.Group>
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
