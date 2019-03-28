import React from 'react'

import * as validators from '../utils/validators.js'

import { MAX_SQL_IDENTIFIER_LENGTH } from '../constants.js'

export default class NewModelForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      model: emptyModel(),
      errors: []
    }
  }

  create = () => {
    const model = formatModel(this.state.model)
    const errors = validateModel(model, this.props.models)

    if (errors.length > 0) {
      this.setState({ errors })
    } else {
      this.props.onCreate({ model })
      this.setState({ model: emptyModel() })
    }
  }

  cancel = () => {
    this.props.onCancel()
    this.setState({ model: emptyModel() })
  }

  inputName = name => {
    const model = { ...this.state.model, name }
    const errors =
      this.state.errors.length > 0
        ? validateModel(formatModel(model), this.props.models)
        : this.state.errors

    this.setState({ model, errors })
  }

  render () {
    return (
      <form
        onSubmit={event => {
          event.preventDefault()
          this.create()
        }}
      >
        <strong>New Model</strong>
        <label htmlFor='new-model-name'>Name</label>
        <input
          id='new-model-name'
          type='text'
          value={this.state.model.name}
          onChange={({ target: { value } }) => this.inputName(value)}
          maxLength={MAX_SQL_IDENTIFIER_LENGTH}
        />
        {this.state.errors.length > 0 ? (
          <ul>
            {this.state.errors.map(error => (
              <li key={error}>{displayModelError(error)}</li>
            ))}
          </ul>
        ) : null}
        <button
          type='submit'
          disabled={
            this.state.model.name.trim().length === 0 ||
            this.state.errors.length > 0
          }
        >
          Create Model
        </button>
        <button type='button' onClick={this.cancel}>
          Cancel
        </button>
      </form>
    )
  }
}

const UNIQUE_NAME_ERROR = 'UNIQUE_NAME_ERROR'
const NAME_FORMAT_ERROR = 'NAME_FORMAT_ERROR'
const REQUIRED_NAME_ERROR = 'REQUIRED_NAME_ERROR'
const NAME_LENGTH_ERROR = 'NAME_LENGTH_ERROR'

const emptyModel = () => ({ name: '' })

const formatModel = model => ({
  ...model,
  name: model.name.trim()
})

const validateModel = (model, models) => {
  const validations = [
    [UNIQUE_NAME_ERROR, validators.validateUniqueName(model, models)],
    [NAME_FORMAT_ERROR, validators.validateIdentifierFormat(model.name)],
    [REQUIRED_NAME_ERROR, validators.validateRequired(model.name)],
    [NAME_LENGTH_ERROR, validators.validateIdentifierLength(model.name)]
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
