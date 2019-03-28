import React from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as sequelize4 from '../templates/sequelize-4.js'
import TopBar from './TopBar.jsx'
import ModelsList from './ModelsList.jsx'
import ModelView from './ModelView.jsx'
import ModelForm from './ModelForm.jsx'

const MODELS_LIST = 'MODELS_LIST'
const MODEL_VIEW = 'MODEL_VIEW'
const MODEL_FORM = 'MODEL_FORM'

const downloadZip = ({ name = 'my-project', files }) => {
  const zip = new JSZip()
  const folder = zip.folder(name)

  files.forEach(file => zipFile(folder, file))

  return zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, name))
}

const zipFile = (zip, file) => {
  if (file.files) zipDir(zip, file)
  else zip.file(file.name, file.content)
}

const zipDir = (zip, dir) => {
  const folder = zip.folder(dir.name)
  for (let file of dir.files) zipFile(folder, file)
}

const emptyModel = () => ({
  name: '',
  fields: [],
  errors: []
})

const initialState = () => ({
  pageState: MODELS_LIST,
  error: null,
  nextModelId: 1,
  nextFieldId: 1,
  config: {
    timestamps: true,
    snake: false,
    softDeletes: false,
    singularTableNames: false,
    dialect: 'sqlite',
    name: 'my-project'
  },
  models: [],
  newModel: null,
  currentModelId: null,
  editingModel: null
})

const buildModel = (id, model) => ({ id, ...model, fields: [] })

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { ...initialState(), ...this.loadState() }
  }

  componentDidUpdate (prevProps, prevState) {
    this.persistState()
  }

  loadState = () => (localStorage['SUI'] ? JSON.parse(localStorage['SUI']) : {})

  persistState = () => localStorage.setItem('SUI', JSON.stringify(this.state))

  exportModels = () =>
    downloadZip(
      sequelize4.files({ models: this.state.models, config: this.state.config })
    )

  reset = () => {
    localStorage.removeItem('SUI')
    location.reload()
  }

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

  startCreatingNewModel = () => this.setState({ newModel: emptyModel() })

  goToModel = id => this.setState({ pageState: MODEL_VIEW, currentModelId: id })

  editModel = id => this.setState({ pageState: MODEL_FORM, currentModelId: id })

  deleteModel = id =>
    this.setState({
      models: this.state.models.filter(model => model.id !== id)
    })

  // New Model Methods
  cancelCreatingNewModel = () => this.setState({ newModel: null })

  createModel = ({ model }) => {
    this.setState({
      models: [...this.state.models, buildModel(this.state.nextModelId, model)],
      nextModelId: this.state.nextModelId + 1
    })
  }

  // Current Model Methods
  startEditingModel = () => this.setState({ pageState: MODEL_FORM })

  goToModels = () =>
    this.setState({ pageState: MODELS_LIST, currentModelId: null })

  // Edit Model Methods
  cancelEditingModel = () => this.setState({ pageState: MODEL_VIEW })

  saveModel = ({ model, nextFieldId }) => {
    this.setState({
      pageState: MODEL_VIEW,
      models: this.state.models.map(m => (m.id === model.id ? model : m)),
      nextFieldId
    })
  }

  deleteCurrentModel = () =>
    this.setState({
      pageState: MODELS_LIST,
      currentModelId: null,
      models: this.state.models.filter(
        model => model.id !== this.state.currentModelId
      )
    })

  // View Methods

  topBarActions = () => [
    {
      onClick: this.previewCode,
      label: 'Code',
      icon: 'code',
      disabled: this.state.pageState === MODEL_FORM
    },

    {
      onClick: this.exportModels,
      label: 'Export',
      icon: 'export',
      disabled: this.state.pageState === MODEL_FORM
    }
  ]

  renderPage = () => {
    console.log(this.state.pageState)
    switch (this.state.pageState) {
      case MODELS_LIST:
        return (
          <ModelsList
            config={this.state.config}
            models={this.state.models}
            newModel={this.state.newModel}
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
          />
        )
      case MODEL_VIEW:
        return (
          <ModelView
            model={this.state.models.find(
              ({ id }) => id === this.state.currentModelId
            )}
            goToModels={this.goToModels}
            startEditingModel={this.startEditingModel}
          />
        )
      case MODEL_FORM:
        return (
          <ModelForm
            modelId={this.state.currentModelId}
            models={this.state.models}
            nextFieldId={this.state.nextFieldId}
            onSave={this.saveModel}
            onCancel={this.cancelEditingModel}
          />
        )
      default:
        return <p>Sorry, something went wrong.</p>
    }
  }

  render () {
    return (
      <React.Fragment>
        <TopBar onTitleClick={this.goToModels} actions={this.topBarActions()} />
        {this.renderPage()}
        <button onClick={this.reset}>Reset</button>
      </React.Fragment>
    )
  }
}
