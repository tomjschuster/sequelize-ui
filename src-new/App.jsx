import React from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as sequelize from './sequelize.js'
import Case from 'case'
import XRegExp from 'xregexp'
const MAX_MODEL_NAME_LENGTH = 63
const UNIQUE_NAME_ERROR = 'Name already taken.'
const NAME_FORMAT_ERROR =
  'Name can only contain letters, numbers, spaces, _ or $ and cannot start with a number.'

const REQUIRED_NAME_ERROR = 'Name is required.'
const NAME_LENGTH_ERROR = `Name cannot be more than ${MAX_MODEL_NAME_LENGTH} characters when converted to snake_case.`

const downloadZip = ({ name = 'untitled', files }) => {
  const zip = new JSZip()
  files.forEach(file => zipFile(zip, file))

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
  errors: []
})

const emptyField = () => ({
  name: '',
  type: null,
  primaryKey: false,
  required: false,
  unique: false,
  errors: []
})

const initialState = () => ({
  error: null,
  nextModelId: 1,
  nextFieldId: 1,
  config: {
    timestamps: true,
    snake: false,
    softDeletes: false
  },
  models: [],
  newModel: null,
  currentModel: null,
  editingModel: null
})

const buildModel = (id, model) => ({ id, ...model })

const buildField = (id, field) => ({ id, ...field })

const formatModel = model => ({ ...model, name: model.name.trim() })

const validateModel = (model, models) => {
  const errors = [
    [
      UNIQUE_NAME_ERROR,
      !!models.find(
        ({ name, id }) =>
          Case.snake(name) === Case.snake(model.name) && id !== model.id
      )
    ],
    [NAME_FORMAT_ERROR, !XRegExp('^[\\p{L}_][\\p{L}\\p{N}$_ ]*$').test(model.name)],
    [REQUIRED_NAME_ERROR, model.name.length === 0],
    [NAME_LENGTH_ERROR, Case.snake(model.name).length > MAX_MODEL_NAME_LENGTH]
  ]

  console.log(errors)

  return errors.filter(error => error[1]).map(error => error[0])
}

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
      sequelize.files({ models: this.state.models, config: this.state.config })
    )

  reset = () => {
    localStorage.removeItem('SUI')
    location.reload()
  }

  // Models Methods
  toggleTimestamps = ({ target: { checked } }) =>
    this.setState({ config: { ...this.state.config, timestamps: checked } })

  toggleSnake = ({ target: { checked } }) =>
    this.setState({ config: { ...this.state.config, snake: checked } })

  toggleSoftDeletes = ({ target: { checked } }) =>
    this.setState({ config: { ...this.state.config, softDeletes: checked } })

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

  inputNewModelName = ({ target: { value } }) => {
    const name = value.slice(0, MAX_MODEL_NAME_LENGTH)
    const newModel = { ...this.state.newModel, name }
    const errors =
      newModel.errors.length > 0
        ? validateModel(formatModel(newModel), this.state.models)
        : newModel.errors

    this.setState({ newModel: { ...newModel, errors } })
  }

  createModel = event => {
    event.preventDefault()
    const newModel = formatModel(this.state.newModel)
    const errors = validateModel(newModel, this.state.models)

    if (errors.length > 0) {
      this.setState({ newModel: { ...newModel, errors } })
    } else {
      this.setState({
        models: [
          ...this.state.models,
          buildModel(this.state.nextModelId, newModel)
        ],
        newModel: emptyModel(),
        nextModelId: this.state.nextModelId + 1
      })
    }
  }

  // Current Model Methods
  startEditingModel = () =>
    this.setState({
      editingModel: { ...this.state.currentModel, newField: emptyField() }
    })

  goToModels = () => this.setState({ currentModel: null, editingModel: null })

  // Edit Model Methods
  cancelEditingModel = () => this.setState({ editingModel: null })

  inputEditingModelName = ({ target: { value } }) => {
    const name = value.slice(0, MAX_MODEL_NAME_LENGTH)
    const editingModel = {...this.state.editingModel, name}

    const errors =
      editingModel.errors.length > 0
        ? validateModel(formatModel(editingModel), this.state.models)
        : editingModel.errors

    this.setState({
      editingModel: { ...editingModel, errors }
    })
  }

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
          buildField(this.state.nextFieldId, this.state.editingModel.newField)
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
    const currentModel = formatModel(this.state.editingModel)
    const errors = validateModel(currentModel, this.state.models)

    if (errors.length > 0) {
      this.setState({ editingModel: { ...this.state.editingModel, errors } })
    } else {
      this.setState({
        currentModel,
        editingModel: null,
        models: this.state.models.map(model =>
          model.id === currentModel.id ? currentModel : model
        )
      })
    }
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

  renderModels = (config, models, newModel) => (
    <React.Fragment>
      <button onClick={this.reset}>Reset</button>
      <button onClick={this.exportModels}>Export</button>
      <h2>Models</h2>
      <h3>Configuration</h3>
      <ul>
        <li key='config-timestamps'>
          <label id='config-timestamps'>Timestamps</label>
          <input
            id='config-timestamps'
            type='checkbox'
            checked={config.timestamps}
            onChange={this.toggleTimestamps}
          />
        </li>
        <li key='config-snake'>
          <label id='config-snake'>Snake Case</label>
          <input
            id='config-snake'
            type='checkbox'
            checked={config.snake}
            onChange={this.toggleSnake}
          />
        </li>
        <li key='config-soft-deletes'>
          <label id='config-soft-deletes'>Soft Deletes</label>
          <input
            id='config-soft-deletes'
            type='checkbox'
            checked={config.softDeletes}
            onChange={this.toggleSoftDeletes}
          />
        </li>
      </ul>
      {newModel !== null ? (
        <form onSubmit={this.createModel}>
          <strong>New Model</strong>
          <label htmlFor='new-model-name'>Name</label>
          <input
            id='new-model-name'
            type='text'
            value={newModel.name}
            onChange={this.inputNewModelName}
            maxLength={MAX_MODEL_NAME_LENGTH}
          />
          {newModel.errors.length > 0 ? (
            <ul>
              {newModel.errors.map(message => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
          <button
            type='submit'
            // disabled={
            //   newModel.name.trim().length === 0 || newModel.errors.length > 0
            // }
          >
            Create Model
          </button>
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
        return this.renderModels(
          this.state.config,
          this.state.models,
          this.state.newModel
        )
    }
  }
}
