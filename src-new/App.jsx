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

const emptyField = () => ({
  name: '',
  type: null,
  primaryKey: false,
  required: false,
  unique: false
})

const initialState = () => ({
  error: null,
  nextModelId: 1,
  nextFieldId: 1,
  models: [],
  newModelName: null,
  currentModel: null,
  editingModel: null
})

const newModel = (id, name) => ({ id, name, fields: [] })

const newField = (id, field) => ({ id, ...field })

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

  exportModels = () => exportModels(this.state.models)

  reset = () => {
    localStorage.removeItem('SUI')
    location.reload()
  }

  // Models Methods
  startCreatingNewModel = () =>
    this.setState({ newModelName: '' })

  goToModel = id =>
    this.setState({ currentModel: this.state.models.find(m => m.id === id) })

  editModel = id => {
    const model = this.state.models.find(m => m.id === id)

    this.setState({
      currentModel: model,
      editingModel: { ...model, newField: emptyField() }
    })
  }

  deleteModel = id =>
    this.setState({
      models: this.state.models.filter(model => model.id !== id)
    })

  // New Model Methods
  cancelCreatingNewModel = () =>
    this.setState({ newModelName: null })

  inputNewModelName = ({ target: { value } }) =>
    this.setState({ newModelName: value })

  createModel = event => {
    event.preventDefault()

    this.setState({
      models: [
        ...this.state.models,
        newModel(this.state.nextModelId, this.state.newModelName)
      ],
      newModelName: '',
      nextModelId: this.state.nextModelId + 1
    })
  }

  // Current Model Methods
  startEditingModel = () =>
    this.setState({ editingModel: { ...this.state.currentModel, newField: emptyField() } })

  goToModels = () => this.setState({ currentModel: null, editingModel: null })

  // Edit Model Methods
  cancelEditingModel = () =>
    this.setState({ editingModel: null })

  inputEditingModelName = ({ target: { value } }) =>
    this.setState({ editingModel: { ...this.state.editingModel, name: value } })

  inputNewFieldName = ({ target: { value } }) =>
    this.mapNewField(field => ({ ...field, name: value }))

  selectNewFieldType = ({ target: { value } }) =>
    this.mapNewField(field => ({ ...field, type: optionToValue(value) }))

  toggleNewFieldPrimaryKey = ({ target: { checked } }) =>
    this.mapNewField(field => ({ ...field, primaryKey: checked }))

  toggleNewFieldRequired = ({ target: { checked } }) =>
    this.mapNewField(field => ({ ...field, required: checked }))

  toggleNewFieldUnique = ({ target: { checked } }) =>
    this.mapNewField(field => ({ ...field, unique: checked }))

  clearNewField = () =>
    this.setState({
      editingModel: {
        ...this.state.editingModel, newField: emptyField()
      }})

  createField = event => {
    event.preventDefault()

    this.setState({
      editingModel: {
        ...this.state.editingModel,
        fields: [
          ...this.state.editingModel.fields,
          newField(this.state.nextFieldId, this.state.editingModel.newField)
        ],
        newField: emptyField()
      },
      nextFieldId: this.state.nextFieldId + 1
    })
  }

  mapNewField = fn =>
    this.setState({
      editingModel: {
        ...this.state.editingModel,
        newField: fn(this.state.editingModel.newField)
      }
    })

  inputEditingFieldName = (id, { target: { value } }) =>
    this.mapField(id, field => ({...field, name: value}))

  selectEditingFieldType = (id, { target: { value } }) =>
    this.mapField(id, field => ({...field, type: optionToValue(value)}))

  toggleEditingFieldPrimaryKey = (id, { target: { checked } }) =>
    this.mapField(id, field => ({...field, primaryKey: checked}))

  toggleEditingFieldRequired = (id, { target: { checked } }) =>
    this.mapField(id, field => ({...field, required: checked}))

  toggleEditingFieldUnique = (id, { target: { checked } }) =>
    this.mapField(id, field => ({...field, unique: checked}))

  deleteField = id =>
    this.setState({
      editingModel: {
        ...this.state.editingModel,
        fields: this.state.editingModel.fields.filter(field => field.id !== id)
      }
    })

  mapField = (id, fn) =>
    this.setState({
      editingModel: {
        ...this.state.editingModel,
        fields: this.state.editingModel.fields.map(field =>
          field.id === id ? fn({ ...field }) : field
        )
      }
    })

  saveModel = () => {
    const { newField, ...editingModel } = this.state.editingModel
    this.setState({
      currentModel: editingModel,
      editingModel: null,
      models: this.state.models.map(model =>
        model.id === editingModel.id ? editingModel : model)
    })
  }

  cancelEditingModel = () =>
    this.setState({ editingModel: null })

  deleteCurrentModel = () =>
    this.setState({
      currentModel: null,
      editingModel: null,
      models: this.state.models.filter(model => model.id !== this.state.currentModel.id)
    })

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

  renderModels = (models, newModelName) =>
    <React.Fragment>
      <button onClick={this.reset}>Reset</button>
      <button onClick={this.startCreatingNewModel}>Add a Model</button>
      <button onClick={this.exportModels}>Export</button>
      <h2>Models</h2>
      {newModelName !== null
        ? <form onSubmit={this.createModel}>
          <input
            type='text'
            value={newModelName}
            onChange={this.inputNewModelName}
          />
          <button type='submit'>Create Model</button>
        </form>
        : null}
      <ul>
        {models.map(model =>
          <li key={model.id}>
            <span onClick={() => this.goToModel(model.id)}>{model.name}</span>
            <button onClick={() => this.editModel(model.id)}>Edit</button>
            <button onClick={() => this.deleteModel(model.id)}>Delete</button>
          </li>
        )}
      </ul>
    </React.Fragment>

  renderCurrentModel = (currentModel) =>
    <React.Fragment>
      <button onClick={this.goToModels}>Back</button>
      <button onClick={this.startEditingModel}>Edit</button>
      <h2>{currentModel.name}</h2>
      <ul key='abc'>
        {currentModel.fields.map(field =>
          <li key={field.id}>
            {field.name} - {dataTypeOptions[field.type]}{' '}
            {this.showFieldOptions(field)}
          </li>
        )}
      </ul>
    </React.Fragment>

  renderEditingModel = (editingModel) =>
    <React.Fragment>
      <button onClick={this.saveModel}>Save</button>
      <button onClick={this.cancelEditingModel}>Cancel</button>
      <label htmlFor='editing-model-name'>Name</label>
      <input
        id='editing-model-name'
        type='text'
        value={editingModel.name}
        onChange={this.inputEditingModelName}
      />
      <h3>NewField</h3>
      <form onSubmit={this.createField}>
        <label htmlFor='new-field-name'>Name</label>
        <input
          id='new-field-name'
          type='text'
          value={editingModel.newField.name}
          onChange={this.inputNewFieldName}
        />
        <label htmlFor='new-field-type'>Type</label>
        <select
          id='new-field-type'
          default={editingModel.newField.type || dataTypeOptions.EMPTY_OPTION}
          value={editingModel.newField.type || dataTypeOptions.EMPTY_OPTION}
          onChange={this.selectNewFieldType}
        >
          {Object.entries(dataTypeOptions).map(([value, text]) =>
            <option key={value} value={value}>{text}</option>
          )
          }
        </select>
        <button type='submit'>Add</button>
        <button type='button' onClick={this.clearNewField}>Clear</button>
      </form>
      <h3>Fields</h3>
      <ul>
        {editingModel.fields.map(field =>
          <li key={field.id}>
            <label htmlFor={`editing-field-name-${field.id}`}>Name</label>
            <input
              id={`editing-field-name-${field.id}`}
              type='text'
              value={field.name}
              onChange={event => this.inputEditingFieldName(field.id, event)}
            />
            <label htmlFor={`editing-field-type-${field.id}`}>Type</label>
            <select
              id={`editing-field-type-${field.id}`}
              default={field.type || dataTypeOptions.EMPTY_OPTION}
              value={field.type || dataTypeOptions.EMPTY_OPTION}
              onChange={event => this.selectEditingFieldType(field.id, event)}
            >
              {Object.entries(dataTypeOptions).map(([value, text]) =>
                <option key={value} value={value}>{text}</option>
              )
              }
            </select>
            <button onClick={() => this.deleteField(field.id)}>Delete</button>
          </li>
        )}
      </ul>
    </React.Fragment>

  render () {
    switch (true) {
      case this.state.editingModel !== null:
        return this.renderEditingModel(this.state.editingModel)
      case this.state.currentModel !== null:
        return this.renderCurrentModel(this.state.currentModel)
      default:
        return this.renderModels(this.state.models, this.state.newModelName)
    }
  }
}
