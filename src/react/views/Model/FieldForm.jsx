import React from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'

import * as validators from '../../../utils/validators.js'

import {
  DATA_TYPES,
  DATA_TYPE_OPTIONS,
  MAX_SQL_IDENTIFIER_LENGTH
} from '../../../constants.js'

import Button from '../../components/Button.jsx'
import Checkbox from '../../components/Checkbox.jsx'

const DEFAULT_DATA_TYPE = DATA_TYPES.STRING

const emptyField = modelId => ({
  id: uuid(),
  modelId,
  name: '',
  type: DEFAULT_DATA_TYPE,
  primaryKey: false,
  required: false,
  unique: false
})

export default class FieldForm extends React.Component {
  static propTypes = {
    modelId: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    fieldId: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  }

  state = {
    field:
      this.props.fields.find(f => f.id === this.props.fieldId) ||
      emptyField(this.props.modelId),
    errors: []
  }

  constructor (props) {
    super(props)

    this.createRefs()
  }

  createRefs = () => {
    this.nameInput = React.createRef()
  }

  componentDidMount () {
    this.focusOnName()
  }

  focusOnName () {
    this.nameInput.current && this.nameInput.current.focus()
  }

  save = () => {
    const field = formatField(this.state.field)
    const errors = validateField(field, this.props.fields)

    if (errors.length > 0) {
      this.setState({ errors })
    } else {
      this.props.onSave({ field })
      this.setState({ field: emptyField(this.props.modelId) })
      this.focusOnName()
    }
  }

  cancel = () => {
    this.props.onCancel()
    this.setState({ field: emptyField(this.props.modelId) })
  }

  inputName = name => this.mapField(field => ({ ...field, name }))
  selectField = type => this.mapField(field => ({ ...field, type }))

  togglePrimaryKey = primaryKey =>
    this.mapField(field => ({ ...field, primaryKey }))

  toggleRequired = required => this.mapField(field => ({ ...field, required }))

  toggleUnique = unique => this.mapField(field => ({ ...field, unique }))

  mapField = fn => {
    const field = fn(this.state.field)

    const errors =
      this.state.errors.length > 0
        ? validateField(formatField(field), this.props.fields)
        : this.state.errors

    this.setState({ field, errors })
  }

  render () {
    const { props, state } = this

    return (
      <form
        id='field-form'
        className='field-form field-form'
        onSubmit={event => {
          event.preventDefault()
          this.save()
        }}
        onKeyDown={evt => {
          if (evt.keyCode === 27) {
            evt.preventDefault()
            this.cancel()
          }
        }}
      >
        <div className='field-form__item field-form__name'>
          <label htmlFor='new-field-name'>Name</label>
          <input
            ref={this.nameInput}
            id='new-field-name'
            type='text'
            value={state.field.name}
            onChange={event => this.inputName(event.target.value)}
          />
        </div>
        <div className='field-form__item field-form__type'>
          <label htmlFor='new-field-type'>Type</label>
          <select
            id='new-field-type'
            default={state.field.type || DEFAULT_DATA_TYPE}
            value={state.field.type || DEFAULT_DATA_TYPE}
            onChange={event => this.selectField(event.target.value)}
          >
            {Object.entries(DATA_TYPE_OPTIONS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div className='field-form__item field-form__options'>
          <Checkbox
            id='new-field-primary-key'
            className='field-form__option'
            label='Primary Key'
            checked={state.field.primaryKey}
            onCheck={this.togglePrimaryKey}
          />
          <Checkbox
            id='new-field-unique'
            className='field-form__option'
            label='Unique'
            checked={state.field.unique}
            onCheck={this.toggleUnique}
          />
          <Checkbox
            id='new-field-required'
            className='field-form__option'
            label='Required'
            checked={state.field.required}
            onCheck={this.toggleRequired}
          />
        </div>
        <div className='field-form__item field-form__actions'>
          <Button
            secondary
            type='submit'
            icon='check'
            className='field-form__action'
            label={props.fieldId ? 'Update' : 'Add'}
            disabled={state.errors.length > 0}
          />
          <Button
            secondary
            type='button'
            icon='cancel'
            className='field-form__action'
            label='Cancel'
            onClick={this.cancel}
          />
        </div>

        {state.errors.length ? (
          <ul>
            {state.errors.map(error => (
              <li key={error}>{displayErrors(error)}</li>
            ))}
          </ul>
        ) : null}
      </form>
    )
  }
}

const formatField = field => ({ ...field, name: field.name.trim() })

const UNIQUE_NAME_ERROR = 'UNIQUE_NAME_ERROR'
const NAME_FORMAT_ERROR = 'NAME_FORMAT_ERROR'
const REQUIRED_NAME_ERROR = 'REQUIRED_NAME_ERROR'
const NAME_LENGTH_ERROR = 'NAME_LENGTH_ERROR'
const REQUIRED_TYPE_ERROR = 'REQUIRED_TYPE_ERROR'

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

const displayErrors = error => {
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
