import React from 'react'
import PropTypes from 'prop-types'

import * as validators from '../../utils/validators.js'

import {
  DATA_TYPES,
  DATA_TYPE_OPTIONS,
  MAX_SQL_IDENTIFIER_LENGTH
} from '../../constants.js'

import Button from '../components/Button.jsx'
import Checkbox from '../components/Checkbox.jsx'

const DEFAULT_DATA_TYPE = DATA_TYPES.STRING

export default class EditModel extends React.Component {
  constructor (props) {
    super(props)

    this.modelNameInput = React.createRef()
    this.newFieldNameInput = React.createRef()
    this.addFieldButton = React.createRef()

    const model = this.props.models.find(({ id }) => id === this.props.modelId)

    this.state = {
      prevModel: { ...model },
      model: { ...model },
      newField: null,
      modelErrors: [],
      newFieldErrors: [],
      fieldErrors: emptyFieldErrors(model.fields),
      nextFieldId: this.props.nextFieldId
    }
  }

  componentDidMount () {
    this.modelNameInput.current.focus()
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.newField && this.state.newField) {
      this.newFieldNameInput.current.focus()
    }

    if (prevState.model.fields.length < this.state.model.fields.length) {
      this.newFieldNameInput.current.focus()
      this.newFieldNameInput.current.scrollIntoView()
    }
  }

  save = () => {
    const model = formatModel(this.state.model)
    const modelErrors = validateModel(model, this.props.models)

    const fieldErrors = model.fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.id]: validateField(field, this.state.model.fields)
      }),
      this.state.fieldErrors
    )

    if (!this.checkErrors(modelErrors, fieldErrors)) {
      this.props.onSave({
        model,
        nextFieldId: this.state.nextFieldId
      })
    } else {
      this.setState({ model, modelErrors, fieldErrors })
    }
  }

  cancel = () => this.props.onCancel()

  // Model

  inputModelName = name => this.mapModel(model => ({ ...model, name }))

  mapModel = fn => {
    const model = fn(this.state.model)

    const modelErrors =
      this.state.modelErrors.length > 0
        ? validateModel(formatModel(model), this.props.models)
        : this.state.modelErrors

    this.setState({ model, modelErrors })
  }

  // New Field
  startCreatingField = () => this.setState({ newField: emptyField() })
  cancelCreatingField = () => {
    this.setState({ newField: null })
    setTimeout(() => this.addFieldButton.current.focus(), 0)
  }
  inputNewFieldName = name => this.mapNewField(field => ({ ...field, name }))
  selectNewFieldType = type => this.mapNewField(field => ({ ...field, type }))

  toggleNewFieldPrimaryKey = primaryKey =>
    this.mapNewField(field => ({ ...field, primaryKey }))

  toggleNewFieldRequired = required =>
    this.mapNewField(field => ({ ...field, required }))

  toggleNewFieldUnique = unique =>
    this.mapNewField(field => ({ ...field, unique }))

  mapNewField = fn => {
    const newField = fn(this.state.newField)

    const newFieldErrors =
      this.state.newFieldErrors.length > 0
        ? validateField(formatField(newField), this.state.model.fields)
        : this.state.newFieldErrors

    this.setState({ newField, newFieldErrors })
  }

  clearNewField = () =>
    this.setState({ newField: emptyField(), newFieldErrors: [] })

  createField = () => {
    const newField = formatField(this.state.newField)
    const newFieldErrors = validateField(newField, this.state.model.fields)

    if (newFieldErrors.length > 0) {
      this.setState({ newField, newFieldErrors })
    } else {
      const field = buildField(this.state.nextFieldId, newField)
      const fieldErrors = { ...this.state.fieldErrors, [field.id]: [] }

      this.setState({
        model: {
          ...this.state.model,
          fields: [...this.state.model.fields, field]
        },
        newField: emptyField(),
        newFieldErrors: [],
        fieldErrors,
        nextFieldId: this.state.nextFieldId + 1
      })
    }
  }

  // Fields

  inputFieldName = (id, name) =>
    this.mapField(id, field => ({ ...field, name }))

  selectFieldType = (id, type) =>
    this.mapField(id, field => ({ ...field, type }))

  toggleEditingFieldPrimaryKey = (id, primaryKey) =>
    this.mapField(id, field => ({ ...field, primaryKey }))

  toggleEditingFieldRequired = (id, required) =>
    this.mapField(id, field => ({ ...field, required }))

  toggleEditingFieldUnique = (id, unique) =>
    this.mapField(id, field => ({ ...field, unique }))

  mapField = (id, fn) => {
    const currentField = this.state.model.fields.find(field => field.id === id)
    const currentErrors = this.state.fieldErrors[id]

    const field = fn(currentField)
    const errors =
      currentErrors.length > 0
        ? validateField(formatField(field), this.state.model.fields)
        : currentErrors

    const fields = this.state.model.fields.map(f => (f.id === id ? field : f))
    const fieldErrors = { ...this.state.fieldErrors, [id]: errors }

    this.setState({ model: { ...this.state.model, fields }, fieldErrors })
  }

  deleteField = id => {
    const { [id]: _, ...fieldErrors } = this.state.fieldErrors
    const fields = this.state.model.fields.filter(field => field.id !== id)
    this.setState({ model: { ...this.state.model, fields }, fieldErrors })
  }

  // Errors

  hasErrors = () =>
    this.hasModelErrors() || this.hasNewFieldErrors() || this.hasFieldErrors()

  hasModelErrors = () => this.state.modelErrors.length > 0
  hasNewFieldErrors = () => this.state.newFieldErrors.length > 0

  hasFieldErrors = () =>
    Object.values(this.state.fieldErrors).some(errors => errors.length > 0)

  fieldHasErrors = id => this.state.fieldErrors[id].length > 0

  checkErrors = (modelErrors, fieldErrors) =>
    modelErrors.length > 0 ||
    Object.values(fieldErrors).some(errors => errors.length > 0)

  render () {
    return (
      <main className='main-content'>
        <div className='content-wrapper'>
          <h2 className='title'>Edit {this.state.prevModel.name} Model</h2>
          <form
            id='model-form'
            onSubmit={evt => {
              evt.preventDefault()
              this.save()
            }}
          >
            <fieldset className='edit-model__actions'>
              <Button
                primary
                type='submit'
                icon='save'
                label='Save'
                disabled={this.hasErrors()}
              />
              <Button
                primary
                type='button'
                icon='cancel'
                label='Cancel'
                onClick={this.cancel}
              />
            </fieldset>
            <fieldset className='edit-model__model'>
              <div className='edit-model-name'>
                <label htmlFor='editing-model-name'>Name</label>
                <input
                  ref={this.modelNameInput}
                  id='editing-model-name'
                  className='edit-model-name'
                  type='text'
                  value={this.state.model.name}
                  onChange={evt => this.inputModelName(evt.target.value)}
                />
              </div>
              {this.hasModelErrors() ? (
                <ul>
                  {this.state.modelErrors.map(error => (
                    <li key={error}>{displayModelError(error)}</li>
                  ))}
                </ul>
              ) : null}
            </fieldset>
            <fieldset className='edit-model__fields-set'>
              <h3 className='subtitle'>Fields</h3>
              <ul className='edit-model__fields list'>
                {this.state.model.fields.map(field => (
                  <li className='form-field list__item' key={field.id}>
                    <div className='form-field__item form-field__name'>
                      <label htmlFor={`field-name-${field.id}`}>Name</label>
                      <input
                        id={`field-name-${field.id}`}
                        type='text'
                        value={field.name}
                        onChange={evt =>
                          this.inputFieldName(field.id, evt.target.value)
                        }
                      />
                    </div>
                    <div className='form-field__item form-field__type'>
                      <label htmlFor={`field-type-${field.id}`}>Type</label>
                      <select
                        id={`field-type-${field.id}`}
                        default={field.type || DEFAULT_DATA_TYPE}
                        value={field.type || DEFAULT_DATA_TYPE}
                        onChange={evt =>
                          this.selectFieldType(field.id, evt.target.value)
                        }
                      >
                        {Object.entries(DATA_TYPE_OPTIONS).map(
                          ([value, text]) => (
                            <option key={value} value={value}>
                              {text}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className='form-field__item form-field__options'>
                      <Checkbox
                        id={`field-primary-key-${field.id}`}
                        label='Primary Key'
                        checked={field.primaryKey}
                        onCheck={checked =>
                          this.toggleEditingFieldPrimaryKey(field.id, checked)
                        }
                      />
                      <Checkbox
                        id={`field-unique-${field.id}`}
                        label='Unique'
                        checked={field.unique}
                        onCheck={checked =>
                          this.toggleEditingFieldUnique(field.id, checked)
                        }
                      />
                      <Checkbox
                        id={`field-required-${field.id}`}
                        label='Required'
                        checked={field.required}
                        onCheck={checked =>
                          this.toggleEditingFieldRequired(field.id, checked)
                        }
                      />
                    </div>
                    <div className='form-field__item form-field__actions'>
                      <Button
                        primary
                        type='button'
                        className='delete-field-button'
                        icon='delete'
                        label='Delete'
                        onClick={() => this.deleteField(field.id)}
                      />
                    </div>
                    {this.fieldHasErrors(field.id) ? (
                      <ul>
                        {this.state.fieldErrors[field.id].map(error => (
                          <li key={error}>{displayFieldError(error)}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
                {this.state.newField ? (
                  <li
                    className='form-field list__item'
                    onKeyDown={evt => {
                      if (evt.keyCode === 13) {
                        evt.preventDefault()
                        this.createField()
                      }

                      if (evt.keyCode === 27) {
                        evt.preventDefault()
                        this.cancelCreatingField()
                      }
                    }}
                  >
                    <div className='form-field__item form-field__name'>
                      <label htmlFor='new-field-name'>Name</label>
                      <input
                        ref={this.newFieldNameInput}
                        id='new-field-name'
                        type='text'
                        value={this.state.newField.name}
                        onChange={evt =>
                          this.inputNewFieldName(evt.target.value)
                        }
                      />
                    </div>
                    <div className='form-field__item form-field__type'>
                      <label htmlFor='new-field-type'>Type</label>
                      <select
                        id='new-field-type'
                        default={this.state.newField.type || DEFAULT_DATA_TYPE}
                        value={this.state.newField.type || DEFAULT_DATA_TYPE}
                        onChange={evt =>
                          this.selectNewFieldType(evt.target.value)
                        }
                      >
                        {Object.entries(DATA_TYPE_OPTIONS).map(
                          ([value, text]) => (
                            <option key={value} value={value}>
                              {text}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className='form-field__item form-field__options'>
                      <Checkbox
                        id='new-field-primary-key'
                        className='form-field__option'
                        label='Primary Key'
                        checked={this.state.newField.primaryKey}
                        onCheck={this.toggleNewFieldPrimaryKey}
                      />
                      <Checkbox
                        id='new-field-unique'
                        className='form-field__option'
                        label='Unique'
                        checked={this.state.newField.unique}
                        onCheck={this.toggleNewFieldUnique}
                      />
                      <Checkbox
                        id='new-field-required'
                        className='form-field__option'
                        label='Required'
                        checked={this.state.newField.required}
                        onCheck={this.toggleNewFieldRequired}
                      />
                    </div>
                    <div className='form-field__item form-field__actions'>
                      <Button
                        primary
                        type='button'
                        icon='check'
                        className='form-field__action'
                        label='Add'
                        disabled={this.hasNewFieldErrors()}
                        onClick={this.createField}
                      />
                      <Button
                        primary
                        type='button'
                        icon='cancel'
                        className='form-field__action'
                        label='Cancel'
                        onClick={this.cancelCreatingField}
                      />
                    </div>

                    {this.hasNewFieldErrors() ? (
                      <ul>
                        {this.state.newFieldErrors.map(error => (
                          <li key={error}>{displayFieldError(error)}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ) : (
                  <li className='add-new-field list__item'>
                    <Button
                      ref={this.addFieldButton}
                      primary
                      type='button'
                      icon='add'
                      label='Add a Field'
                      onClick={this.startCreatingField}
                    />
                  </li>
                )}
              </ul>
            </fieldset>
          </form>
        </div>
      </main>
    )
  }
}

EditModel.propTypes = {
  models: PropTypes.arrayOf(PropTypes.object).isRequired,
  modelId: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

const formatModel = model => ({
  ...model,
  name: model.name.trim(),
  fields: model.fields.map(field => formatField(field))
})

const formatField = field => ({ ...field, name: field.name.trim() })
const buildField = (id, field) => ({ id, ...field })

const UNIQUE_NAME_ERROR = 'UNIQUE_NAME_ERROR'
const NAME_FORMAT_ERROR = 'NAME_FORMAT_ERROR'
const REQUIRED_NAME_ERROR = 'REQUIRED_NAME_ERROR'
const NAME_LENGTH_ERROR = 'NAME_LENGTH_ERROR'
const REQUIRED_TYPE_ERROR = 'REQUIRED_TYPE_ERROR'

const validateModel = (model, models) => {
  const validations = [
    [UNIQUE_NAME_ERROR, validators.validateUniqueName(model, models)],
    [NAME_FORMAT_ERROR, validators.validateIdentifierFormat(model.name)],
    [REQUIRED_NAME_ERROR, validators.validateRequired(model.name)],
    [NAME_LENGTH_ERROR, validators.validateIdentifierLength(model.name)]
  ]

  return validations.filter(([_, valid]) => !valid).map(([error, _]) => error)
}

const validateField = (field, fields) => {
  const validations = [
    [UNIQUE_NAME_ERROR, validators.validateUniqueName(field, fields)],
    [NAME_FORMAT_ERROR, validators.validateIdentifierFormat(field.name)],
    [REQUIRED_NAME_ERROR, validators.validateRequired(field.name)],
    [NAME_LENGTH_ERROR, validators.validateIdentifierLength(field.name)],
    [REQUIRED_TYPE_ERROR, validators.validateRequired(field.type)]
  ]

  return validations.filter(([_, valid]) => !valid).map(([error, _]) => error)
}

const displayModelError = error => {
  switch (error) {
    case UNIQUE_NAME_ERROR:
      return 'Name already taken.'
    case NAME_FORMAT_ERROR:
      return 'Name can only contain letters, numbers, spaces, _ or $ and cannot start with a number.'
    case REQUIRED_NAME_ERROR:
      return 'Name is required.'
    case NAME_LENGTH_ERROR:
      return `Name cannot be more than ${MAX_SQL_IDENTIFIER_LENGTH} characters when converted to snake_case.`
  }
}

const displayFieldError = error => {
  switch (error) {
    case UNIQUE_NAME_ERROR:
      return 'Name already taken.'
    case NAME_FORMAT_ERROR:
      return 'Name can only contain letters, numbers, spaces, _ or $ and cannot start with a number.'
    case REQUIRED_NAME_ERROR:
      return 'Name is required.'
    case NAME_LENGTH_ERROR:
      return `Name cannot be more than ${MAX_SQL_IDENTIFIER_LENGTH} characters when converted to snake_case.`
    case REQUIRED_TYPE_ERROR:
      return 'Type is required.'
    default:
      return 'Sorry, something went wront.'
  }
}

const emptyField = () => ({
  name: '',
  type: DEFAULT_DATA_TYPE,
  primaryKey: false,
  required: false,
  unique: false
})

const emptyFieldErrors = fields =>
  fields.reduce((acc, { id }) => ({ ...acc, [id]: [] }), {})
