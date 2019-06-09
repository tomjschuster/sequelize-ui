import React from 'react'
import PropTypes from 'prop-types'

import * as validators from '../../../utils/validators.js'

import { MAX_SQL_IDENTIFIER_LENGTH } from '../../../constants.js'

import Button from '../../components/Button.jsx'

export default class ModelNameForm extends React.Component {
  constructor (props) {
    super(props)

    this.nameInput = React.createRef()

    console.log(
      'props',
      this.props.name,
      'model',
      initialModel(this.props.modelId, this.props.name)
    )

    this.state = {
      model: initialModel(this.props.modelId, this.props.name),
      errors: []
    }
  }

  componentDidMount () {
    this.focusOnName()
  }

  focusOnName () {
    this.nameInput.current.focus()
  }

  inputName = name =>
    this.setState(({ model, errors }) => {
      const updatedModel = { ...model, name }

      const updatedErrors =
        errors.length > 0
          ? validateModel(formatModel(updatedModel), this.props.models)
          : errors

      return { model: updatedModel, errors: updatedErrors }
    })

  save = () => {
    const model = formatModel(this.state.model)
    const errors = validateModel(model, this.props.models)

    if (errors.length > 0) {
      this.setState({ errors })
    } else {
      console.log('saving', model)
      this.props.onSave({ name: model.name })
    }
  }

  cancel = () => {
    this.props.onCancel()
    this.setState({ name: '', errors: [] })
  }

  render () {
    return (
      <form
        onSubmit={event => {
          event.preventDefault()
          this.save()
        }}
      >
        <input
          ref={this.nameInput}
          id='new-model-name'
          className='new-model-form__name'
          type='text'
          value={this.state.model.name}
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
        {this.state.errors.length > 0 ? (
          <ul>
            {this.state.errors.map(error => (
              <li key={error}>{displayModelError(error)}</li>
            ))}
          </ul>
        ) : null}
        <Button
          primary
          type='submit'
          icon='check'
          label='Update'
          className='new-model-form__add'
          disabled={
            this.state.model.name.trim().length === 0 ||
            this.state.errors.length > 0
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

ModelNameForm.propTypes = {
  models: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

const UNIQUE_NAME_ERROR = 'UNIQUE_NAME_ERROR'
const NAME_FORMAT_ERROR = 'NAME_FORMAT_ERROR'
const REQUIRED_NAME_ERROR = 'REQUIRED_NAME_ERROR'
const NAME_LENGTH_ERROR = 'NAME_LENGTH_ERROR'

const initialModel = (id, name) => ({ id, name })

const formatModel = model => ({
  ...model,
  name: model.name.trim()
})

const validateModel = (model, models) => {
  const validations = [
    [
      UNIQUE_NAME_ERROR,
      console.log(model, models) ||
        validators.validateUniqueName(model, models)
    ],
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
