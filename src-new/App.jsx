import React from 'react'
import { exportModels } from '../src/utils'

const EMPTY_OPTION = 'EMPTY_OPTION'
const optionToValue = value => (value === EMPTY_OPTION ? null : value)

const dataTypeOptions = {
  EMPTY_OPTION: '-',
  STRING: 'String',
  TEXT: 'Text',
  INTEGER: 'Integer',
  FLOAT: 'Float',
  REAL: 'Real',
  DOUBLE: 'Double',
  DECIMAL: 'Decimal',
  DATE: 'Date',
  DATEONLY: 'Date (without time)',
  BOOLEAN: 'Boolean',
  ARRAY: 'Array',
  JSON: 'JSON',
  BLOB: 'BLOB',
  UUID: 'UUID'
}

export default class App extends React.Component {
  constructor (props) {
    super(props)
    const prevState = localStorage['SUI'] ? JSON.parse(localStorage['SUI']) : {}
    this.state = { ...App.initialState(), ...prevState }
  }

  static initialState = () => ({
    error: null,
    nextModelId: 1,
    nextFieldId: 1,
    models: [],
    currentModel: null,
    editingModel: App.initialEditingModel(),
    editingField: App.initialEditingField()
  })

  static initialEditingModel = () => ({
    name: ''
  })

  static initialEditingField = () => ({
    name: '',
    type: null,
    primaryKey: false,
    required: false,
    unique: false
  })

  componentDidUpdate (prevProps, prevState) {
    localStorage.setItem('SUI', JSON.stringify(this.state))
  }

  exportModels = () => exportModels(this.state.models)

  reset = () => {
    localStorage.removeItem('SUI')
    location.reload()
  }

  // New Model
  inputEditingModelName = ({ target: { value } }) =>
    this.setState({ editingModel: { ...this.state.editingModel, name: value } })

  createModel = event => {
    event.preventDefault()
    this.setState({
      models: [...this.state.models, this.newModel()],
      editingModel: App.initialEditingModel(),
      nextModelId: this.state.nextModelId + 1
    })
  }

  newModel = () => ({
    id: this.state.nextModelId,
    name: this.state.editingModel.name,
    fields: []
  })

  deleteModel = id =>
    this.setState({
      models: this.state.models.filter(model => model.id !== id)
    })

  // Edit Model Name
  editModelName = () => this.setState({ editingModel: this.state.currentModel })

  saveModelName = () =>
    this.setState({
      editingModel: App.initialEditingModel(),
      currentModel: this.state.editingModel
    })

  cancelModelName = () =>
    this.setState({ editingModel: App.initialEditingModel() })

  // New Field
  editField = id => {
    const field = this.state.currentModel.fields.find(f => f.id === id)
    if (field) this.setState({ editingField: field })
  }

  inputEditingFieldName = ({ target: { value } }) =>
    this.setState({
      editingField: { ...this.state.editingField, name: value }
    })

  selectEditingFieldType = ({ target: { value } }) =>
    this.setState({
      editingField: { ...this.state.editingField, type: optionToValue(value) }
    })

  toggleEditingFieldPrimaryKey = ({ target: { checked } }) =>
    this.setState({
      editingField: { ...this.state.editingField, primaryKey: checked }
    })

  toggleEditingFieldRequired = ({ target: { checked } }) =>
    this.setState({
      editingField: { ...this.state.editingField, required: checked }
    })

  toggleEditingFieldUnique = ({ target: { checked } }) =>
    this.setState({
      editingField: { ...this.state.editingField, unique: checked }
    })

  saveField = event => {
    event.preventDefault()
    this.state.editingField.id ? this.saveExistingField() : this.saveNewField()
  }

  saveNewField = () => {
    this.setState({
      currentModel: {
        ...this.state.currentModel,
        fields: [...this.state.currentModel.fields, this.getNewField()]
      },
      editingField: App.initialEditingField(),
      nextFieldId: this.state.nextFieldId + 1
    })
  }

  saveExistingField = () => {
    const fields = this.state.currentModel.fields.map(field =>
      field.id === this.state.editingField.id ? this.state.editingField : field
    )

    this.setState({
      currentModel: { ...this.state.currentModel, fields },
      editingField: App.initialEditingField()
    })
  }

  getNewField = () => ({
    id: this.state.nextFieldId,
    name: this.state.editingField.name,
    type: this.state.editingField.type,
    primaryKey: this.state.editingField.primaryKey,
    required: this.state.editingField.required,
    unique: this.state.editingField.unique
  })

  deleteField = id =>
    this.setState({
      currentModel: {
        ...this.state.currentModel,
        fields: this.state.currentModel.fields.filter(field => field.id !== id)
      }
    })

  saveUpdatedModel = () => {
    console.log('saving model')
    const models = this.state.models.map(model =>
      model.id == this.state.currentModel.id ? this.state.currentModel : model
    )

    this.setState({ models, currentModel: null })
  }

  goToModels = () => this.setState({ currentModel: null })

  goToModel = id => {
    const model = this.state.models.find(m => m.id === id)
    if (model) this.setState({ currentModel: model })
    else this.setState({ error: 'Model not found' })
  }

  // View methods
  showFieldOptions = field => {
    const options = {
      primaryKey: 'Primary Key',
      required: 'Required',
      unique: 'Unique'
    }

    const display = Object.entries(options)
      .filter(([option, _]) => field[option])
      .map(([_, text]) => text)
      .join(', ')

    return display ? `(${display})` : ''
  }

  render () {
    if (this.state.currentModel) {
      return (
        <React.Fragment>
          <h1>Sequelize UI</h1>
          <button onClick={this.reset}>Reset</button>
          <button onClick={this.goToModels}>Back</button>
          <button onClick={this.saveUpdatedModel}>Save</button>
          {this.state.editingModel.id ? (
            <div>
              <input
                type='text'
                onChange={this.inputEditingModelName}
                value={this.state.editingModel.name}
              />
              <button onClick={this.saveModelName}>Save</button>
              <button onClick={this.cancelModelName}>Cancel</button>
            </div>
          ) : (
            <h2>
              {this.state.currentModel.name}
              <button onClick={this.editModelName}>Edit</button>
            </h2>
          )}
          <form onSubmit={this.saveField}>
            <input
              type='text'
              value={this.state.editingField.name}
              onChange={this.inputEditingFieldName}
            />
            <select
              value={this.state.editingField.type || EMPTY_OPTION}
              onChange={this.selectEditingFieldType}
            >
              {Object.entries(dataTypeOptions).map(([value, text]) => (
                <option key={value || EMPTY_OPTION} value={value}>
                  {text}
                </option>
              ))}
            </select>
            <label>
              Primary Key
              <input
                type='checkbox'
                checked={this.state.editingField.primaryKey}
                onChange={this.toggleEditingFieldPrimaryKey}
              />
            </label>
            <label>
              Required
              <input
                type='checkbox'
                checked={this.state.editingField.required}
                onChange={this.toggleEditingFieldRequired}
              />
            </label>

            <label>
              Unique
              <input
                type='checkbox'
                checked={this.state.editingField.unique}
                onChange={this.toggleEditingFieldUnique}
              />
            </label>
            <button type='submit'>
              {this.state.editingField.id ? 'Save Field' : 'Create Field'}
            </button>
          </form>
          <ul>
            {this.state.currentModel.fields.map(field => (
              <li key={field.id}>
                <span onClick={() => this.editField(field.id)}>
                  {field.name} - {dataTypeOptions[field.type]}{' '}
                  {this.showFieldOptions(field)}
                </span>
                <button onClick={() => this.deleteField(field.id)}>X</button>
              </li>
            ))}
          </ul>
          <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <h1>Sequelize UI</h1>
          <button onClick={this.exportModels}>Export</button>
          <button onClick={this.reset}>Reset</button>
          <form onSubmit={this.createModel}>
            <input
              type='text'
              value={this.state.editingModel.name}
              onChange={this.inputEditingModelName}
            />
            <button type='submit'>Create Model</button>
          </form>
          <ul>
            {this.state.models.map(model => (
              <li key={model.id}>
                <span onClick={() => this.goToModel(model.id)}>
                  {model.name}
                </span>
                <button onClick={() => this.deleteModel(model.id)}>X</button>
              </li>
            ))}
          </ul>
          <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
        </React.Fragment>
      )
    }
  }
}
