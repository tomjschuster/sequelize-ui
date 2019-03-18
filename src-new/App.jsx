import React from 'react'
import { downloadZip } from './export.js'
import sequelizeFiles from './sequelize/files.js'

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

const emptyModel = () => ({
  name: '',
  fields: [],
  config: {
    timestamps: true,
    snake: false,
    softDeletes: false
  }
})

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
  newModel: null,
  currentModel: null,
  editingModel: null
})

const newModel = (id, model) => ({ id, ...model })

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

  exportModels = () => downloadZip(sequelizeFiles({ models: this.state.models }))

  reset = () => {
    localStorage.removeItem('SUI')
    location.reload()
  }

  // Models Methods
  startCreatingNewModel = () => this.setState({ newModel: emptyModel() })

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
  cancelCreatingNewModel = () => this.setState({ newModel: null })

  inputNewModelName = ({ target: { value } }) =>
    this.setState({ newModel: { ...this.state.newModel, name: value } })

  createModel = event => {
    event.preventDefault()

    this.setState({
      models: [
        ...this.state.models,
        newModel(this.state.nextModelId, this.state.newModel)
      ],
      newModel: emptyModel(),
      nextModelId: this.state.nextModelId + 1
    })
  }

  // Current Model Methods
  startEditingModel = () =>
    this.setState({
      editingModel: { ...this.state.currentModel, newField: emptyField() }
    })

  goToModels = () => this.setState({ currentModel: null, editingModel: null })

  // Edit Model Methods
  cancelEditingModel = () => this.setState({ editingModel: null })

  inputEditingModelName = ({ target: { value } }) =>
    this.setState({ editingModel: { ...this.state.editingModel, name: value } })

  toggleEditingModelTimestamps = ({ target: { checked } }) =>
    this.mapEditingConfig(config => ({ ...config, timestamps: checked }))

  toggleEditingModelSnake = ({ target: { checked } }) =>
    this.mapEditingConfig(config => ({ ...config, snake: checked }))

  toggleEditingModelSoftDeletes = ({ target: { checked } }) =>
    this.mapEditingConfig(config => ({ ...config, softDeletes: checked }))

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
        ...this.state.editingModel,
        newField: emptyField()
      }
    })

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

  mapEditingConfig = fn =>
    this.setState({
      editingModel: {
        ...this.state.editingModel,
        config: fn(this.state.editingModel.config)
      }
    })
  mapNewField = fn =>
    this.setState({
      editingModel: {
        ...this.state.editingModel,
        newField: fn(this.state.editingModel.newField)
      }
    })

  inputEditingFieldName = (id, { target: { value } }) =>
    this.mapField(id, field => ({ ...field, name: value }))

  selectEditingFieldType = (id, { target: { value } }) =>
    this.mapField(id, field => ({ ...field, type: optionToValue(value) }))

  toggleEditingFieldPrimaryKey = (id, { target: { checked } }) =>
    this.mapField(id, field => ({ ...field, primaryKey: checked }))

  toggleEditingFieldRequired = (id, { target: { checked } }) =>
    this.mapField(id, field => ({ ...field, required: checked }))

  toggleEditingFieldUnique = (id, { target: { checked } }) =>
    this.mapField(id, field => ({ ...field, unique: checked }))

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
        model.id === editingModel.id ? editingModel : model
      )
    })
  }

  cancelEditingModel = () => this.setState({ editingModel: null })

  deleteCurrentModel = () =>
    this.setState({
      currentModel: null,
      editingModel: null,
      models: this.state.models.filter(
        model => model.id !== this.state.currentModel.id
      )
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

  renderCurrentModelConfiguration = ({ timestamps, snake, softDeletes }) => {
    const items = [
      ['Timestamps', timestamps],
      ['Snake Case', snake],
      ['Soft Deletes', softDeletes]
    ]
    console.log(items)

    const selectedItems = items
      .filter(([_, selected]) => selected)
      .map(([label, _]) => label)
    console.log(selectedItems)
    return selectedItems.length === 0 ? null : (
      <React.Fragment>
        <h3>Configuration</h3>
        <ul>
          {selectedItems.map(label => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </React.Fragment>
    )
  }

  renderModels = (models, newModel) => (
    <React.Fragment>
      <button onClick={this.reset}>Reset</button>
      <button onClick={this.exportModels}>Export</button>
      <h2>Models</h2>
      {newModel !== null ? (
        <form onSubmit={this.createModel}>
          <strong>New Model</strong>
          <label htmlFor='new-model-name'>Name</label>
          <input
            id='new-model-name'
            type='text'
            value={newModel.name}
            onChange={this.inputNewModelName}
          />
          <button type='submit'>Create Model</button>
          <button type='button' onClick={this.cancelCreatingNewModel}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={this.startCreatingNewModel}>Add a Model</button>
      )}
      <ul>
        {models.map(model => (
          <li key={model.id}>
            {model.name}
            <button onClick={() => this.goToModel(model.id)}>View</button>
            <button onClick={() => this.editModel(model.id)}>Edit</button>
            <button onClick={() => this.deleteModel(model.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </React.Fragment>
  )

  renderCurrentModel = currentModel => (
    <React.Fragment>
      <button onClick={this.goToModels}>Back</button>
      <button onClick={this.startEditingModel}>Edit</button>
      <h2>{currentModel.name}</h2>
      <h3>Configuration</h3>
      <ul>
        <li key='timestamps'>
          Timestamps: {currentModel.config.timestamps ? 'Yes' : 'No'}
        </li>
        <li key='snake'>
          Casing: {currentModel.config.snake ? 'Snake' : 'Camel'}
        </li>
        <li key='deletes'>
          Deletes: {currentModel.config.softDeletes ? 'Soft' : 'Hard'}
        </li>
      </ul>
      <h3>Fields</h3>
      {currentModel.fields.length === 0 ? (
        <p>No Fields</p>
      ) : (
        <ul key='abc'>
          {currentModel.fields.map(field => (
            <li key={field.id}>
              {field.name} - {dataTypeOptions[field.type]}{' '}
              {this.showFieldOptions(field)}
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
  )

  renderEditingModel = editingModel => (
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
      <h3>Configuration</h3>
      <ul>
        <li key='editing-model-config-timestamps'>
          <label id='editing-model-config-timestamps'>Timestamps</label>
          <input
            id='editing-model-config-timestamps'
            type='checkbox'
            checked={editingModel.config.timestamps}
            onChange={this.toggleEditingModelTimestamps}
          />
        </li>
        <li key='editing-model-config-snake'>
          <label id='editing-model-config-snake'>Snake Case</label>
          <input
            id='editing-model-config-snake'
            type='checkbox'
            checked={editingModel.config.snake}
            onChange={this.toggleEditingModelSnake}
          />
        </li>
        <li key='editing-model-config-soft-deletes'>
          <label id='editing-model-config-soft-deletes'>Soft Deletes</label>
          <input
            id='editing-model-config-soft-deletes'
            type='checkbox'
            checked={editingModel.config.softDeletes}
            onChange={this.toggleEditingModelSoftDeletes}
          />
        </li>
      </ul>
      <h3>Fields</h3>
      <form onSubmit={this.createField}>
        <strong>NewField</strong>
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
          {Object.entries(dataTypeOptions).map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        <label id='new-field-primary-key'>Primary Key</label>
        <input
          id='new-field-primary-key'
          type='checkbox'
          checked={editingModel.newField.primaryKey}
          onChange={this.toggleNewFieldPrimaryKey}
        />
        <label id='new-field-unique'>Unique</label>
        <input
          id='new-field-unique'
          type='checkbox'
          checked={editingModel.newField.unique}
          onChange={this.toggleNewFieldUnique}
        />
        <label id='new-field-required'>Required</label>
        <input
          id='new-field-required'
          type='checkbox'
          checked={editingModel.newField.required}
          onChange={this.toggleNewFieldRequired}
        />
        <button type='submit'>Add</button>
        <button type='button' onClick={this.clearNewField}>
          Clear
        </button>
      </form>
      <ul>
        {editingModel.fields.map(field => (
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
              {Object.entries(dataTypeOptions).map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
            <label id={`editing-field-primary-key-${field.id}`}>
              Primary Key
            </label>
            <input
              id={`editing-field-primary-key-${field.id}`}
              type='checkbox'
              checked={field.primaryKey}
              onChange={event =>
                this.toggleEditingFieldPrimaryKey(field.id, event)
              }
            />
            <label id={`editing-field-unique-${field.id}`}>Unique}</label>
            <input
              id={`editing-field-unique-${field.id}`}
              type='checkbox'
              checked={field.unique}
              onChange={event => this.toggleEditingFieldUnique(field.id, event)}
            />
            <label id={`editing-field-required-${field.id}`}>Required</label>
            <input
              id={`editing-field--required-${field.id}`}
              type='checkbox'
              checked={field.required}
              onChange={event =>
                this.toggleEditingFieldRequired(field.id, event)
              }
            />
            <button onClick={() => this.deleteField(field.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </React.Fragment>
  )

  render () {
    switch (true) {
      case this.state.editingModel !== null:
        return this.renderEditingModel(this.state.editingModel)
      case this.state.currentModel !== null:
        return this.renderCurrentModel(this.state.currentModel)
      default:
        return this.renderModels(this.state.models, this.state.newModel)
    }
  }
}
