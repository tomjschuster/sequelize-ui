import React from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as sequelize4 from '../templates/sequelize-4.js'
import TopBar from './TopBar.jsx'
import Button from './Button.jsx'
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

const initialState = () => ({
  pageState: MODELS_LIST,
  nextModelId: 1,
  nextFieldId: 1,
  config: initialConfig(),
  models: [],
  creatingNewModel: false,
  currentModelId: null,
  editingModel: null
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

export default class App extends React.Component {
  constructor (props) {
    super(props)
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

  loadState = () => (localStorage['SUI'] ? JSON.parse(localStorage['SUI']) : {})

  persistState = keys => {
    const stateToPersist = Object.entries(this.state)
      .filter(([key, value]) => keys.includes(key))
      .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {})

    localStorage.setItem('SUI', JSON.stringify(stateToPersist))
  }

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

  cancelCreatingNewModel = () => this.setState({ creatingNewModel: false })

  createModel = ({ model }) => {
    this.setState({
      models: [...this.state.models, buildModel(this.state.nextModelId, model)],
      nextModelId: this.state.nextModelId + 1
    })
  }

  // Current Model Methods
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
    switch (this.state.pageState) {
      case MODELS_LIST:
        return (
          <ModelsList
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
          />
        )
      case MODEL_VIEW:
        return (
          <ModelView
            model={this.state.models.find(
              ({ id }) => id === this.state.currentModelId
            )}
            goToModels={this.goToModels}
            editModel={this.editCurrentModel}
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

  render () {
    return (
      <React.Fragment>
        <TopBar onTitleClick={this.goToModels} actions={this.topBarActions()} />
        {this.renderPage()}
        <footer className='footer'>
          <Button className='footer__reset' label='Reset' onClick={this.reset} />
        </footer>
      </React.Fragment>
    )
  }
}
