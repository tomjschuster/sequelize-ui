import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import {
  thunks as modelsThunks,
  actionCreators as modelsActions
} from '../../redux/models'
import { actionCreators as formsActions } from '../../redux/forms'
import { actionCreators as uiActions } from '../../redux/ui'

/* ----------  APP COMPONENTS  ---------- */
import AppBar from '../AppBar'
import PreviewModelModal from './PreviewModelModal'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button, Input, Container, Card, Divider } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
const ModelCard = ({
  media,
  // State
  isCurrent,
  modelNameObj,
  model,
  // Actions
  handleModelKeyDown,
  handleActionKeyDown,
  previewModel,
  gotoModel,
  removeModel
}) =>
  <Card
    className='model-card'
    tabIndex={-1}
    onKeyDown={handleModelKeyDown}
    onFocus={evt => evt.stopPropagation()}
  >
    <Card.Content>
      <div className='model-card-header'>
        <Card.Header as='h3' content={model.name} />
      </div>
      <div className='model-card-btns'>
        <Button
          id={`preview-${model.id}`}
          className='model-card-btn'
          icon='eye'
          size='tiny'
          circular
          onClick={previewModel}
          tabIndex={-1}
          onKeyDown={handleActionKeyDown}
          onFocus={evt => evt.stopPropagation()}
        />
        <Button
          id={`edit-${model.id}`}
          className='model-card-btn'
          icon='pencil'
          size='tiny'
          circular
          onClick={gotoModel}
          tabIndex={-1}
          onKeyDown={handleActionKeyDown}
          onFocus={evt => evt.stopPropagation()}
        />
        <Button
          id={`delete-${model.id}`}
          className='model-card-btn'
          icon='trash'
          size='tiny'
          circular
          onClick={removeModel}
          tabIndex={-1}
          onKeyDown={handleActionKeyDown}
          onFocus={evt => evt.stopPropagation()}
        />
      </div>
    </Card.Content>
  </Card>

class Schema extends React.Component {
  constructor (props) {
    super(props)
    this.nameInput = React.createRef()
    this.addModelButton = React.createRef()
    this.state = { activeModel: null, activeAction: null }
  }

  // Life cycle methods

  componentDidMount () {
    this.focusOnAddModelButton()
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.creatingModel && this.props.creatingModel) {
      this.focusOnNameInput()
    }

    if (prevProps.creatingModel && !this.props.creatingModel) {
      this.focusOnAddModelButton()
    }

    if (prevState.activeModel !== this.state.activeModel) {
      this.setState({ activeAction: null })
    }
  }

  componentWillUnmount () {
    this.props.modelsActions.cancelPreviewModel()
  }

  // Static methods

  static focusOnParentModel = button => {
    const model = button.closest('.model-card')
    if (model !== null) model.focus()
  }

  static focusOnModel = idx =>
    document.querySelector(`.model-card:nth-child(${idx + 1})`).focus()

  static focusOnAction = (modelIdx, actionIdx) => {
    const selector =
      `.model-card:nth-child(${modelIdx + 1}) .model-card-btn:nth-child(${actionIdx + 1})`

    document.querySelector(selector).focus()
  }

  // Instance methods

  // Navigation
  gotoModel = id => this.props.history.push(`/${id}`)
  editModel = id => this.props.history.push(`/${id}/edit`)

  // DOM events
  handleModelKeyDown = evt => {
    switch (evt.key) {
      case 'Enter':
        evt.preventDefault()
        return this.focusOnActiveAction()
      case 'ArrowRight': return this.focusOnNextModel()
      case 'ArrowLeft': return this.focusOnPrevModel()
      default:
    }
  }

  handleActionKeyDown = evt => {
    switch (evt.key) {
      case 'ArrowRight':
        evt.stopPropagation()
        return this.focusOnNextAction()
      case 'ArrowLeft':
        evt.stopPropagation()
        return this.focusOnPrevAction()
      case 'Escape':
        evt.stopPropagation()
        return Schema.focusOnParentModel(evt.target)
      case 'Enter':
        return evt.stopPropagation()
      default:
    }
  }

  // Focus

  focusOnNameInput = () =>
    this.nameInput.current && this.nameInput.current.focus()

  focusOnAddModelButton = () =>
    this.addModelButton.current && this.addModelButton.current.focus()

  // State

  focusOnActiveModel = () => this.updateModelFocus(this.getActiveModel())

  focusOnNextModel = () => {
    const current = this.getActiveModel()
    if (current !== null) {
      const next = current + 1 === this.props.models.length ? 0 : current + 1
      this.updateModelFocus(next)
    }
  }

  focusOnActiveAction = () =>
    this.updateActionFocus(this.getActiveModel(), this.getActiveAction())

  focusOnNextAction = () => {
    const activeModel = this.getActiveModel()
    const current = this.getActiveAction()
    if (activeModel !== null) {
      const next = current + 1 === 3 ? 0 : current + 1
      this.updateActionFocus(activeModel, next)
    }
  }

  focusOnPrevAction = () => {
    const activeModel = this.getActiveModel()
    const current = this.getActiveAction()
    if (activeModel !== null) {
      const prev = current - 1 < 0 ? 2 : current - 1
      this.updateActionFocus(activeModel, prev)
    }
  }

  focusOnPrevModel = () => {
    const current = this.getActiveModel()
    if (current !== null) {
      const prev = current - 1 < 0 ? this.props.models.length - 1 : current - 1
      this.updateModelFocus(prev)
    }
  }

  updateModelFocus = idx => {
    if (idx === null) {
      this.setState({ activeModel: null })
    } else {
      this.setState({ activeModel: idx })
      Schema.focusOnModel(idx)
    }
  }

  getActiveModel = () => {
    const maxIdx = this.props.models.length - 1
    switch (true) {
      case maxIdx < 0: return null
      case this.state.activeModel === null: return 0
      case this.state.activeModel > maxIdx: return maxIdx
      default: return this.state.activeModel
    }
  }

  updateActionFocus = (modelIdx, actionIdx) => {
    this.setState({ activeAction: actionIdx })
    Schema.focusOnAction(modelIdx, actionIdx)
  }

  getActiveAction = () => {
    return this.state.activeAction === null ? 0 : this.state.activeAction
  }

  render () {
    const {
      history,
      currentId,
      models,
      previewModel,
      newModelName,
      creatingModel,
      modelsActions,
      uiActions,
      modelsThunks: { createModel },
      formsActions: { inputModelsModelName }
    } = this.props

    return (
      <React.Fragment>
        <AppBar
          menuLinks={[{ active: true, icon: 'cubes', label: 'Models' }]}
        />
        <Container id='content'>
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
                  <Button onClick={() => createModel(newModelName)}>
                    Create
                  </Button>
                  <Button onClick={() => uiActions.stopCreatingModel()}>
                    Cancel
                  </Button>
                </Input>
              )
              : (
                <Button
                  ref={this.addModelButton}
                  onClick={uiActions.startCreatingModel}
                  className='create-model-btn'
                >
                Create a Model
                </Button>
              )
            }
          </Container>
          <Divider />
          <Card.Group centered tabIndex={0} onFocus={this.focusOnActiveModel}>
            {models.map(model => (
              <ModelCard
                key={model.id}
                isCurrent={model.id === currentId}
                model={model}
                previewModel={() => modelsActions.previewModel(model.id)}
                gotoModel={() => history.push(`/${model.id}`)}
                removeModel={() => modelsActions.removeModel(model.id)}
                handleActionKeyDown={this.handleActionKeyDown}
              />
            ))}
          </Card.Group>
        </Container>
        <PreviewModelModal
          model={previewModel}
          close={modelsActions.cancelPreviewModel}
          edit={() => history.push(`/${previewModel.id}`)}
        />
      </React.Fragment>
    )
  }
}
const mapStateToProps = ({ currentModel, models: { models, previewModel }, forms, ui }) => ({
  currentId: currentModel.id,
  models,
  previewModel: previewModel && models.find(({ id }) => previewModel === id),
  newModelName: forms.models.newModelName,
  creatingModel: ui.addModelState.creatingModel
})

const mapDispatchToProps = dispatch => ({
  modelsActions: bindActionCreators(modelsActions, dispatch),
  formsActions: bindActionCreators(formsActions, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Schema)
