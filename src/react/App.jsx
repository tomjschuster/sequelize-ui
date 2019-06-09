import React from 'react'
import Header from './components/Header.jsx'
import Button from './components/Button.jsx'
import Message from './components/Message.jsx'
import Project from './views/Project.jsx'
import Model from './views/Model.jsx'

const PROJECT = 'PROJECT'
const MODEL = 'MODEL'
const MESSAGE_TIME = 1750

export default class App extends React.Component {
  state = {
    pageState: PROJECT,
    nextModelId: 1,
    nextFieldId: 1,
    config: {
      timestamps: true,
      snake: false,
      singularTableNames: false,
      dialect: 'sqlite',
      name: 'my-project'
    },
    models: [],
    currentModelId: null,
    messages: []
  }

  constructor (props) {
    super(props)
    this.createRefs()

    this.state = { ...this.state, ...this.loadState() }
  }

  createRefs = () => {
    this.projectComponent = React.createRef()
  }

  // Persistence
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

  // Navigation
  goToProject = () =>
    this.setState({ pageState: PROJECT, currentModelId: null })

  goToModel = id => this.setState({ pageState: MODEL, currentModelId: id })

  // Messages
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
    this.setState(({ config }) => ({
      config: { ...config, timestamps: !config.timestamps }
    }))

  toggleSnake = () =>
    this.setState(({ config }) => ({
      config: { ...config, snake: !config.snake }
    }))

  toggleSingularTableNames = () =>
    this.setState(({ config }) => ({
      config: { ...config, singularTableNames: !config.singularTableNames }
    }))

  createModel = ({ model }) => {
    this.setState({
      models: [...this.state.models, buildModel(this.state.nextModelId, model)],
      nextModelId: this.state.nextModelId + 1
    })
  }

  deleteModel = id =>
    this.setState({
      models: this.state.models.filter(model => model.id !== id)
    })

  // Model Methods
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

  // View Methods

  renderPage = () => {
    switch (this.state.pageState) {
      case PROJECT:
        return (
          <Project
            ref={this.projectComponent}
            config={this.state.config}
            models={this.state.models}
            toggleTimestamps={this.toggleTimestamps}
            toggleSnake={this.toggleSnake}
            toggleSingularTableNames={this.toggleSingularTableNames}
            createModel={this.createModel}
            goToModel={this.goToModel}
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
            model={model}
            models={this.state.models}
            config={this.state.config}
            goToProject={this.goToProject}
            updateModelName={this.updateModelName}
            createField={this.createField}
            updateField={this.updateField}
            deleteField={this.deleteField}
            newMessage={this.newMessage}
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
        <Header
          actions={this.topBarActions()}
          onTitleClick={this.goToProject}
        />
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
