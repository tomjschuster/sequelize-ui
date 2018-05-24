import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { withMedia } from 'react-media-query-hoc'

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
import AppBar from './AppBar'
import { CONFIG_DISPLAY } from './Model/Configuration'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Modal, Button, Icon, Input, Container, Card, Divider, Table } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
class Schema extends React.Component {
  constructor (props) {
    super(props)
    this.nameInput = React.createRef()
    this.addModelButton = React.createRef()
    this.state = { activeModel: null, activeAction: null }
  }

  gotoModel = id => this.props.history.push(`/${id}`)
  editModel = id => this.props.history.push(`/${id}/edit`)

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

  focusOnActiveModel = () => this.updateModelFocus(this.getActiveModel())

  focusOnNextModel = () => {
    const current = this.getActiveModel()
    if (current !== null) {
      const next = current + 1 === this.props.models.length ? 0 : current + 1
      this.updateModelFocus(next)
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
      this.focusOnModel(idx)
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

  focusOnModel = idx =>
    document.querySelector(`.model-card:nth-child(${idx + 1})`).focus()

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

  static focusOnParentModel = button => {
    const model = button.closest('.model-card')
    if (model !== null) model.focus()
  }

  focusOnActiveAction = () =>
    console.log('here') || this.updateActionFocus(this.getActiveModel(), this.getActiveAction())

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

  updateActionFocus = (modelIdx, actionIdx) => {
    this.setState({ activeAction: actionIdx })
    this.focusOnAction(modelIdx, actionIdx)
  }

  getActiveAction = () => {
    return this.state.activeAction === null ? 0 : this.state.activeAction
  }

  focusOnAction = (modelIdx, actionIdx) => {
    const selector =
      `.model-card:nth-child(${modelIdx + 1}) .model-card-btn:nth-child(${actionIdx + 1})`

    document.querySelector(selector).focus()
  }

  handleModalKeyDown = (evt, otherClass) => {
    if (evt.key === 'Tab') {
      evt.preventDefault()
      document.querySelector(otherClass).focus()
    }
  }

  focusOnModalEdit = () => document.querySelector('.edit-btn').focus()

  focusOnNameInput = () =>
    this.nameInput.current && this.nameInput.current.focus()

  focusOnAddModelButton = () =>
    this.addModelButton.current && this.addModelButton.current.focus()

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

  static ModelCard = ({
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

  static PreviewModal = ({ model, close, edit, handleModalKeyDown, media}) =>
    <Modal
      closeOnDimmerClick
      open={Boolean(model)}
      onClose={close}
      size='large'
      className='preview-modal'
    >
      {model &&
      <React.Fragment>
        <Modal.Header>
          {model.name}
          <Button
            className='close-btn'
            icon='cancel'
            onClick={close}
            onKeyDown={evt => handleModalKeyDown(evt, '.edit-btn')}
          />
          <Button
            className='edit-btn'
            icon='edit'
            onClick={edit}
            onKeyDown={evt => handleModalKeyDown(evt, '.close-btn')}
          />
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {model.fields.length ? Schema.viewFields(model.fields, media) : null}
            {Schema.viewMethods(model.methods)}
            {Schema.viewConfiguration(model.config)}
          </Modal.Description>
        </Modal.Content>
      </React.Fragment>
      }
    </Modal>

    static viewMethods = methods => {
      const methodDisplays =
        Object.keys(methods)
          .filter(key => methods[key])
          .map(key => CONFIG_DISPLAY[key])

      return methodDisplays.length
        ? <p>{`Method Templates: ${methodDisplays.join(', ')}`}</p>
        : null
    }

    static viewConfiguration = config => {
      const configDisplays =
        Object.keys(config)
          .filter(key => config[key])
          .map(key =>
            typeof config[key] === 'boolean'
              ? CONFIG_DISPLAY[key]
              : `${CONFIG_DISPLAY[key]}: ${config[key]}`
          )

      return configDisplays.length
        ? <p>{`Configuration: ${configDisplays.join(', ')}`}</p>
        : null
    }

    static viewFields = (fields, media) => {
      return (
        media.smallScreen
          ? <React.Fragment>
            {fields.map((field, idx) => (
              <Table
                attached
                celled
                structured
                unstackable
                textAlign='center'
                key={field.id}
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan='2'>{field.name}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Data Type</Table.Cell>
                    <Table.Cell>{field.type}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Primary Key</Table.Cell>
                    <Table.Cell>{Schema.checkIf(field.primaryKey)}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Unique Key</Table.Cell>
                    <Table.Cell>{Schema.checkIf(field.unique)}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Not Null</Table.Cell>
                    <Table.Cell>{Schema.checkIf(!field.allowNull)}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Default Value</Table.Cell>
                    <Table.Cell>{field.default}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Auto Increment</Table.Cell>
                    <Table.Cell>{Schema.checkIf(field.autoIncrement)}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            ))}
          </React.Fragment>
          : <Table celled unstackable compact textAlign='center' size='large'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Field</Table.HeaderCell>
                <Table.HeaderCell>Data Type</Table.HeaderCell>
                <Table.HeaderCell>Primary Key</Table.HeaderCell>
                <Table.HeaderCell>Unique Key</Table.HeaderCell>
                <Table.HeaderCell>Not Null</Table.HeaderCell>
                <Table.HeaderCell>Default Value</Table.HeaderCell>
                <Table.HeaderCell>Auto Increment</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fields.map(field => (
                <Table.Row key={field.id}>
                  <Table.Cell>{field.name}</Table.Cell>
                  <Table.Cell>{field.type}</Table.Cell>
                  <Table.Cell>{Schema.checkIf(field.primaryKey)}</Table.Cell>
                  <Table.Cell>{Schema.checkIf(field.unique)}</Table.Cell>
                  <Table.Cell>{Schema.checkIf(!field.allowNull)}</Table.Cell>
                  <Table.Cell>{field.default}</Table.Cell>
                  <Table.Cell>{Schema.checkIf(field.autoIncrement)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
      )
    }

    static checkIf = condition => condition
      ? <Icon color='green' name='checkmark' size='large' /> : null

    render () {
      const {
        history,
        media,
        currentId,
        models,
        previewModel,
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
          <AppBar
            menuLinks={[
              { active: true, icon: 'cubes', label: 'Models' }
            ]}
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
                <Schema.ModelCard
                  key={model.id}
                  isCurrent={model.id === currentId}
                  model={model}
                  previewModel={() => modelsActions.previewModel(model.id)}
                  gotoModel={() => history.push(`/${model.id}`)}
                  removeModel={() => modelsActions.removeModel(model.id)}
                  handleModelKeyDown={this.handleModelKeyDown}
                  handleActionKeyDown={this.handleActionKeyDown}
                />
              ))}
            </Card.Group>
          </Container>
          <Schema.PreviewModal
            model={previewModel}
            media={media}
            close={modelsActions.cancelPreviewModel}
            edit={() => history.push(`/${previewModel.id}`)}
            handleModalKeyDown={this.handleModalKeyDown}
          />
        </React.Fragment>
      )
    }
}
const mapStateToProps = ({ currentModel, models: { models, previewModel }, forms, ui, errors }) => ({
  currentId: currentModel.id,
  models,
  previewModel: previewModel && models.find(({ id }) => previewModel === id),
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

export default compose(
  withMedia,
  connect(mapStateToProps, mapDispatchToProps)
)(Schema)
