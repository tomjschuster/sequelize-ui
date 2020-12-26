import React from 'react'

import { Blog } from '../utils/sample-data.js'
import Storage from '../utils/Storage.js'
import * as stateUtils from '../utils/state.js'

import Header from './components/Header.jsx'
import Button from './components/Button.jsx'
import Message from './components/Message.jsx'
import Modal from './components/Modal.jsx'
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

const CLEAR_MODAL = 'CLEAR_MODAL'
const RESET_MODAL = 'RESET_MODAL'

const initialState = {
  loaded: false,
  pageState: LOADING,
  config: {
    timestamps: true,
    snake: false,
    singularTableNames: false,
    dialect: 'sqlite',
    name: 'my-project'
  },
  models: [],
  currentModelId: null,
  messages: [],
  modal: null
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

  mergePersistedState () {
    Promise.all([this.fetchPersistedState(), this.flags.get('hasReadAbout')])
      .then(([persistedData, hasReadAbout]) => {
        const pageState = this.getLandingPage(persistedData, hasReadAbout)
        persistedData.pageState = pageState
        persistedData.loaded = true
        this.setState(persistedData)
    })
  }

  fetchPersistedState () {
    return this.store.load().then(state =>
      state.models
        ? {
          ...state,
          models: state.models.map(m => (m.assocs ? m : { ...m, assocs: [] }))
       }
       : state
    )
  }

  loadDefaultProject = () => this.setState({ models: Blog.models })

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
      const keysToPersist = ['pageState', 'config', 'models', 'currentModelId']

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

  // Modal

  openClearModal = () => this.setState({ modal: CLEAR_MODAL })
  openResetModal = () => this.setState({ modal: RESET_MODAL })
  closeModal = () => this.setState({ modal: null })

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

  createModel = ({ model }) =>
    this.setState({ models: [...this.state.models, model] })

  deleteModel = id =>
    this.setState({
      models: this.state.models
        .filter(model => model.id !== id)
        .map(model => ({
          ...model,
          assocs: model.assocs.filter(assoc => assoc.targetId !== id)
        }))
    })

  // Model Methods
  updateModelName = ({ name }) =>
    this.setState(({ models, currentModelId }) => ({
      models: models.map(model =>
        model.id === currentModelId ? updateModelName(model, name) : model
      )
    }))

  createField = ({ field }) =>
    this.setState(({ models, currentModelId }) => ({
      models: models.map(model =>
        model.id === currentModelId ? addField(model, field) : model
      )
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

  createAssoc = ({ assoc }) =>
    this.setState(({ models, currentModelId }) => ({
      models: models.map(model =>
        model.id === currentModelId ? addAssoc(model, assoc) : model
      )
    }))

  updateAssoc = ({ assoc }) =>
    this.setState(({ models, currentModelId }) => ({
      models: models.map(model =>
        model.id === currentModelId ? updateAssoc(model, assoc) : model
      )
    }))

  deleteAssoc = assocId =>
    this.setState(({ models, currentModelId }) => ({
      models: models.map(model =>
        model.id === currentModelId ? removeAssoc(model, assocId) : model
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
            goToModel={this.goToModel}
            goToProject={this.goToProject}
            updateModelName={this.updateModelName}
            createField={this.createField}
            updateField={this.updateField}
            deleteField={this.deleteField}
            createAssoc={this.createAssoc}
            updateAssoc={this.updateAssoc}
            deleteAssoc={this.deleteAssoc}
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
      label: 'Source Code',
      newTab: false
    }

    return [aboutLink, projectLink, githubLink]
  }

  renderFooterActions = () => {
    return this.state.pageState === ABOUT ||
      this.state.pageState === LOADING ? null : (
        <div className='footer__reset'>
          <Button icon='reset' label='Reset' onClick={this.openResetModal} />
          <Button icon='cancel' label='Clear' onClick={this.openClearModal} />
        </div>
      )
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
          <div className='footer__content'>
            <p className='footer__copyright'>
              © 2016-present{' '}
              <a href='https://github.com/tomjschuster'>Tom Schuster</a>
            </p>
            {this.renderFooterActions()}
          </div>
        </footer>
        <Message time={MESSAGE_TIME} messages={this.state.messages} />
        <Modal
          title={
            this.state.modal === RESET_MODAL ? 'Reset Project' : 'Clear Project'
          }
          open={this.state.modal !== null}
          onClose={this.closeModal}
          footNote={
            <p>
              All models are persisted locally through{' '}
              <a
                href='https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'
                target='_blank'
              >
                localStorage
              </a>
              .
            </p>
          }
          actions={
            <div className='modal__buttons'>
              <Button
                secondary
                label='Confirm'
                onClick={
                  this.state.modal === RESET_MODAL ? this.reset : this.clear
                }
              />
              <Button
                className='cancel'
                label='Cancel'
                onClick={this.closeModal}
              />
            </div>
          }
        >
          {this.state.modal === RESET_MODAL
            ? 'Are you sure you want to reset Sequelize UI to its initial state? You will lose all of your models.'
            : 'Are you sure you want to clear your project? You will lose all of your models.'}
        </Modal>
      </React.Fragment>
    )
  }
}

const updateModelName = (model, name) => ({ ...model, name })

const addField = (model, field) => ({
  ...model,
  fields: [...model.fields, field]
})

const updateField = (model, field) => ({
  ...model,
  fields: model.fields.map(f => (f.id === field.id ? field : f))
})

const removeField = (model, fieldId) => ({
  ...model,
  fields: model.fields.filter(field => field.id !== fieldId)
})

const addAssoc = (model, assoc) => ({
  ...model,
  assocs: [...model.assocs, assoc]
})

const updateAssoc = (model, assoc) => ({
  ...model,
  assocs: model.assocs.map(f => (f.id === assoc.id ? assoc : f))
})

const removeAssoc = (model, assocId) => ({
  ...model,
  assocs: model.assocs.filter(assoc => assoc.id !== assocId)
})
