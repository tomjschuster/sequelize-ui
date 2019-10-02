import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'

import * as validators from '../../../utils/validators.js'

import { MAX_SQL_IDENTIFIER_LENGTH } from '../../../constants.js'

import Button from '../../components/Button.jsx'

const emptyModel = () => ({ id: uuid(), name: '', fields: [], assocs: [] })

export default class NewModelForm extends React.Component {
  static propTypes = {
    models: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired
  }

  state = {
    model: emptyModel(),
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
    this.nameInput.current.focus()
  }

  create = () => {
    const model = formatModel(this.state.model)
    const errors = validateModel(model, this.props.models)

    if (errors.length > 0) {
      this.setState({ errors })
    } else {
      this.props.onCreate({ model })
      this.setState({ model: emptyModel() })
      this.focusOnName()
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
    const { state } = this

    return (
      <form
        className='new-model-form'
        onSubmit={event => {
          event.preventDefault()
          this.create()
        }}
      >
        <input
          ref={this.nameInput}
          id='new-model-name'
          className='new-model-form__name'
          type='text'
          value={state.model.name}
          placeholder='Name'
          onKeyDown={evt => {
            if (evt.keyCode === 27) {
              evt.preventDefault()
              this.cancel()
            }
          }}
          onChange={({ target: { value } }) => this.inputName(value)}
          maxLength={MAX_SQL_IDENTIFIER_LENGTH}
        />
        {state.errors.length > 0 ? (
          <ul>
            {state.errors.map(error => (
              <li key={error}>{displayModelError(error)}</li>
            ))}
          </ul>
        ) : null}
        <Button
          primary
          type='submit'
          icon='check'
          label='Add'
          className='new-model-form__add'
          disabled={
            state.model.name.trim().length === 0 || state.errors.length > 0
          }
        />
        <Button
          label='Cancel'
          primary
          type='button'
          icon='cancel'
          className='new-model-form__cancel'
          onClick={this.cancel}
        />
      </form>
    )
  }
}

const UNIQUE_NAME_ERROR = 'UNIQUE_NAME_ERROR'
const NAME_FORMAT_ERROR = 'NAME_FORMAT_ERROR'
const REQUIRED_NAME_ERROR = 'REQUIRED_NAME_ERROR'
const NAME_LENGTH_ERROR = 'NAME_LENGTH_ERROR'

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
