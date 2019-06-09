import React from 'react'
import * as sequelize4 from '../templates/sequelize-4.js'
import Header from './components/Header.jsx'
import Button from './components/Button.jsx'
import Message from './components/Message.jsx'
import Project from './views/Project.jsx'
import Model from './views/Model.jsx'
import EditModel from './views/EditModel.jsx'

const PROJECT = 'PROJECT'
const MODEL = 'MODEL'
const EDIT_MODEL = 'EDIT_MODEL'
const MESSAGE_TIME = 1750

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.project = React.createRef()
    this.state = { ...initialState(), ...this.loadState() }
  }

  componentDidUpdate (prevProps, prevState) {
    const keysToPersist = [
      'pageState',
      'nextModelId',
      'nextFieldId',
      'config',
      'models',
      'currentModelId'
    ]

    this.persistState(keysToPersist)
  }

  onProjectExit () {
    this.setState({ creatingNewModel: false })
  }

  onEditModelExit () {
    this.setState({ fromEditModel: true })
  }

  loadState = () => (localStorage['SUI'] ? JSON.parse(localStorage['SUI']) : {})

  persistState = keys => {
    const stateToPersist = Object.entries(this.state)
      .filter(([key, value]) => keys.includes(key))
      .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {})

    localStorage.setItem('SUI', JSON.stringify(stateToPersist))
  }

  reset = () => {
    localStorage.removeItem('SUI')
    location.reload()
  }

  newMessage = (text, type) => {
    const id = Math.random()
    const message = { id, text, type }

    clearTimeout(this.messageTimeout)
    this.messageTimeout = setTimeout(() => this.clearMessage(id), MESSAGE_TIME)
    this.setState({ messages: [message, ...this.state.messages] })
  }

  clearMessage = id =>
    this.setState({ messages: this.state.messages.filter(m => m.id !== id) })

  // Project Methods
  toggleTimestamps = () =>
    this.setState({
      config: {
        ...this.state.config,
        timestamps: !this.state.config.timestamps
      }
    })

  toggleSnake = () =>
    this.setState({
      config: { ...this.state.config, snake: !this.state.config.snake }
    })

  toggleSoftDeletes = () =>
    this.setState({
      config: {
        ...this.state.config,
        softDeletes: !this.state.config.softDeletes
      }
    })

  toggleSingularTableNames = () =>
    this.setState({
      config: {
        ...this.state.config,
        singularTableNames: !this.state.config.singularTableNames
      }
    })

  goToModel = id => this.setState({ pageState: MODEL, currentModelId: id })

  editModel = id =>
    this.setState({
      pageState: EDIT_MODEL,
      currentModelId: id || this.state.currentModelId
    })

  editCurrentModel = () => this.setState({ pageState: EDIT_MODEL })

  deleteModel = id =>
    this.setState({
      models: this.state.models.filter(model => model.id !== id)
    })

  startCreatingNewModel = () => this.setState({ creatingNewModel: true })

  cancelCreatingNewModel = () => {
    this.setState({ creatingNewModel: false })
    setTimeout(
      () => this.project.current && this.project.current.focusOnAddButton(),
      0
    )
  }

  createModel = ({ model }) => {
    this.setState({
      models: [...this.state.models, buildModel(this.state.nextModelId, model)],
      nextModelId: this.state.nextModelId + 1
    })
  }

  // Model Methods
  goToModels = () => this.setState({ pageState: PROJECT, currentModelId: null })

  updateModelName = ({ name }) =>
    this.setState(({ models, currentModelId }) => ({
      models: models.map(model =>
        model.id === currentModelId ? updateModelName(model, name) : model
      )
    }))

  createField = ({ field }) =>
    this.setState(({ models, currentModelId, nextFieldId }) => ({
      models: models.map(model =>
        model.id === currentModelId
          ? addField(model, nextFieldId, field)
          : model
      ),
      nextFieldId: nextFieldId + 1
    }))

  updateField = ({ field }) =>
    this.setState(({ models, currentModelId }) => ({
      models: models.map(model =>
        model.id === currentModelId ? updateField(model, field) : model
      )
    }))

  deleteField = fieldId =>
    this.setState(({ models, currentModelId }) => ({
      models: models.map(model =>
        model.id === currentModelId ? removeField(model, fieldId) : model
      )
    }))

  // Edit Model Methods
  cancelEditingModel = () =>
    this.setState({ pageState: MODEL, fromEditModel: true })

  saveModel = ({ model, nextFieldId }) => {
    this.setState({
      pageState: MODEL,
      models: this.state.models.map(m => (m.id === model.id ? model : m)),
      nextFieldId,
      fromEditModel: true
    })
  }

  deleteCurrentModel = () =>
    this.setState({
      pageState: PROJECT,
      currentModelId: null,
      models: this.state.models.filter(
        model => model.id !== this.state.currentModelId
      )
    })

  clearFromEditModel = () => this.setState({ fromEditModel: true })

  // View Methods

  renderPage = () => {
    switch (this.state.pageState) {
      case PROJECT:
        return (
          <Project
            ref={this.project}
            config={this.state.config}
            models={this.state.models}
            creatingNewModel={this.state.creatingNewModel}
            toggleTimestamps={this.toggleTimestamps}
            toggleSnake={this.toggleSnake}
            toggleSoftDeletes={this.toggleSoftDeletes}
            toggleSingularTableNames={this.toggleSingularTableNames}
            startCreatingNewModel={this.startCreatingNewModel}
            inputNewModelName={this.inputNewModelName}
            cancelCreatingNewModel={this.cancelCreatingNewModel}
            createModel={this.createModel}
            goToModel={this.goToModel}
            editModel={this.editModel}
            deleteModel={this.deleteModel}
            newMessage={this.newMessage}
          />
        )
      case MODEL:
        const model = this.state.models.find(
          ({ id }) => id === this.state.currentModelId
        )
        return (
          <Model
            fromEdit={this.state.fromEditModel}
            model={model}
            models={this.state.models}
            filename={sequelize4.modelFileName(model.name)}
            config={this.state.config}
            goToModels={this.goToModels}
            updateModelName={this.updateModelName}
            createField={this.createField}
            updateField={this.updateField}
            deleteField={this.deleteField}
            editModel={this.editCurrentModel}
            clearFromEdit={this.clearFromEditModel}
            newMessage={this.newMessage}
          />
        )
      case EDIT_MODEL:
        return (
          <EditModel
            modelId={this.state.currentModelId}
            models={this.state.models}
            nextFieldId={this.state.nextFieldId}
            goToModels={this.goToModels}
            onSave={this.saveModel}
            onCancel={this.cancelEditingModel}
          />
        )
      default:
        return <p>Sorry, something went wrong.</p>
    }
  }

  topBarActions () {
    const githubLink = {
      href: 'https://github.com/tomjschuster/sequelize-ui',
      icon: 'github',
      iconPosition: 'above',
      label: 'GitHub'
    }

    return [githubLink]
  }

  render () {
    return (
      <React.Fragment>
        <Header actions={this.topBarActions()} onTitleClick={this.goToModels} />
        {this.renderPage()}
        <footer className='footer'>
          <Button
            className='footer__reset'
            label='Reset'
            onClick={this.reset}
          />
        </footer>
        <Message time={MESSAGE_TIME} messages={this.state.messages} />
      </React.Fragment>
    )
  }
}

const initialState = () => ({
  pageState: PROJECT,
  nextModelId: 1,
  nextFieldId: 1,
  config: initialConfig(),
  models: [],
  creatingNewModel: false,
  currentModelId: null,
  editingModel: null,
  fromEditModel: false,
  messages: []
})

const initialConfig = () => ({
  timestamps: true,
  snake: false,
  softDeletes: false,
  singularTableNames: false,
  dialect: 'sqlite',
  name: 'my-project'
})

const buildModel = (id, model) => ({ id, ...model, fields: [] })
const buildField = (id, field) => ({ id, ...field })

const updateModelName = (model, name) => ({ ...model, name })

const addField = (model, nextFieldId, field) => ({
  ...model,
  fields: [...model.fields, buildField(nextFieldId, field)]
})

const updateField = (model, field) => ({
  ...model,
  fields: model.fields.map(f => (f.id === field.id ? field : f))
})

const removeField = (model, fieldId) => ({
  ...model,
  fields: model.fields.filter(field => field.id !== fieldId)
})
