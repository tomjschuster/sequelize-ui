import React from 'react'

import { Blog } from '../utils/sample-data.js'
import Storage from '../utils/Storage.js'
import * as stateUtils from '../utils/state.js'

import Header from './components/Header.jsx'
import Button from './components/Button.jsx'
import Message from './components/Message.jsx'
import About from './views/About.jsx'
import Project from './views/Project.jsx'
import Model from './views/Model.jsx'

const ABOUT = 'ABOUT'
const LOADING = 'LOADING'
const PROJECT = 'PROJECT'
const MODEL = 'MODEL'
const MESSAGE_TIME = 1750
const STATE_KEY = 'SUI_STATE'
const FLAGS_KEY = 'SUI_FLAGS'

const initialState = {
  loaded: false,
  pageState: LOADING,
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

export default class App extends React.Component {
  state = initialState

  constructor (props) {
    super(props)
    this.createRefs()
  }

  componentDidMount = () => {
    this.loadDefaultProject()
    this.flags = new Storage(FLAGS_KEY)
    this.store = new Storage(STATE_KEY)
    this.mergePersistedState()
  }

  createRefs = () => {
    this.projectComponent = React.createRef()
  }

  async mergePersistedState () {
    const persistedData = await this.store.load()
    const hasRedAbout = await this.flags.get('hasRedAbout')
    const pageState = this.getLandingPage(persistedData, hasRedAbout)
    persistedData.pageState = pageState
    persistedData.loaded = true
    this.setState(persistedData)
  }

  loadDefaultProject = () => {
    this.setState(state => {
      let nextModelId = state.nextModelId
      let nextFieldId = state.nextFieldId

      const models = Blog.models.map(model => ({
        id: nextModelId++,
        ...model,
        fields: model.fields.map(field => ({
          id: nextFieldId++,
          ...field
        }))
      }))

      return { nextModelId, nextFieldId, models }
    })
  }

  getLandingPage = (data, hasRedAbout) => {
    if (data.pageState && data.pageState !== LOADING) {
      return data.pageState
    }

    if (hasRedAbout) {
      return PROJECT
    }

    return ABOUT
  }

  // Persistence
  componentDidUpdate (prevProps, prevState) {
    if (this.state.loaded) {
      const keysToPersist = [
        'pageState',
        'nextModelId',
        'nextFieldId',
        'config',
        'models',
        'currentModelId'
      ]

      const stateToPersist = stateUtils.extract(this.state, keysToPersist)
      this.store.save(stateToPersist)
    }

    if (prevState.page !== this.state.page) {
      this.clearPageState(prevState.page)
    }
  }

  reset = () => {
    this.flags.reset()
    this.store.reset()
    location.reload()
  }

  clear = () => {
    this.flags.reset()
    this.store.reset()
    this.setState({ ...initialState, pageState: PROJECT })
  }

  clearPageState = page => {
    switch (page) {
      case ABOUT:
        this.flags.put('hasRedAbout', true)
        break
      case PROJECT:
        break
      case MODEL:
        this.setState({ currentModelId: true })
        break
      default:
        break
    }
  }

  // Navigation
  goToAbout = () => this.setState({ pageState: ABOUT })

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
      case LOADING:
        return <p>Loading...</p>
      case ABOUT:
        return <About goToProject={this.goToProject} />
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
    const aboutLink = {
      onClick: this.goToAbout,
      icon: 'info',
      iconPosition: 'above',
      label: 'About',
      disabled: this.state.pageState === ABOUT
    }

    const projectLink = {
      onClick: this.goToProject,
      icon: 'cubes',
      iconPosition: 'above',
      label: 'My Project',
      disabled: this.state.pageState === PROJECT
    }

    const githubLink = {
      href: 'https://github.com/tomjschuster/sequelize-ui',
      icon: 'github',
      iconPosition: 'above',
      label: 'GitHub',
      newTab: true
    }

    return [aboutLink, projectLink, githubLink]
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
          <Button
            className='footer__reset'
            label='Clear'
            onClick={this.clear}
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
