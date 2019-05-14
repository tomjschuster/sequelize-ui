import React from 'react'
import * as sequelize4 from '../templates/sequelize-4.js'
import Header from './components/Header.jsx'
import Button from './components/Button.jsx'
import Message from './components/Message.jsx'
import Project from './views/Project.jsx'
import ModelView from './views/ModelView.jsx'
import ModelForm from './forms/ModelForm.jsx'

const PROJECT = 'PROJECT'
const MODEL_VIEW = 'MODEL_VIEW'
const MODEL_FORM = 'MODEL_FORM'
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

  onModelFormExit () {
    this.setState({ fromModelForm: true })
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

  // Models Methods
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

  goToModel = id => this.setState({ pageState: MODEL_VIEW, currentModelId: id })

  editModel = id =>
    this.setState({
      pageState: MODEL_FORM,
      currentModelId: id || this.state.currentModelId
    })

  editCurrentModel = () => this.setState({ pageState: MODEL_FORM })

  deleteModel = id =>
    this.setState({
      models: this.state.models.filter(model => model.id !== id)
    })

  startCreatingNewModel = () => this.setState({ creatingNewModel: true })

  cancelCreatingNewModel = () => {
    this.setState({ creatingNewModel: false })
    setTimeout(() => this.project.current.focusOnAddButton(), 0)
  }

  createModel = ({ model }) => {
    this.setState({
      models: [...this.state.models, buildModel(this.state.nextModelId, model)],
      nextModelId: this.state.nextModelId + 1
    })
  }

  // Current Model Methods
  goToModels = () => this.setState({ pageState: PROJECT, currentModelId: null })

  // Edit Model Methods
  cancelEditingModel = () =>
    this.setState({ pageState: MODEL_VIEW, fromModelForm: true })

  saveModel = ({ model, nextFieldId }) => {
    this.setState({
      pageState: MODEL_VIEW,
      models: this.state.models.map(m => (m.id === model.id ? model : m)),
      nextFieldId,
      fromModelForm: true
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

  clearFromModelForm = () => this.setState({ fromModelForm: true })

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
      case MODEL_VIEW:
        const model = this.state.models.find(
          ({ id }) => id === this.state.currentModelId
        )
        return (
          <ModelView
            fromEdit={this.state.fromModelForm}
            model={model}
            filename={sequelize4.modelFileName(model.name)}
            config={this.state.config}
            goToModels={this.goToModels}
            editModel={this.editCurrentModel}
            clearFromEdit={this.clearFromModelForm}
            newMessage={this.newMessage}
          />
        )
      case MODEL_FORM:
        return (
          <ModelForm
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
  fromModelForm: false,
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
