import React from 'react'
import PropTypes from 'prop-types'

import * as validators from '../../../utils/validators.js'

import {
  MAX_SQL_IDENTIFIER_LENGTH,
  ASSOC_TYPES,
  ASSOC_TYPE_OPTIONS
} from '../../../constants.js'

import Button from '../../components/Button.jsx'

const emptyAssoc = modelId => ({
  type: ASSOC_TYPES.BELONGS_TO,
  modelId,
  as: '',
  through: []
})

export default class AssocForm extends React.Component {
  static propTypes = {
    models: PropTypes.arrayOf(PropTypes.object).isRequired,
    assocId: PropTypes.number,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  }

  state = {
    assoc:
      this.props.assocs.find(f => f.id === this.props.assocId) ||
      emptyAssoc(this.props.models[0].id),
    errors: []
  }

  constructor (props) {
    super(props)

    this.createRefs()
  }

  createRefs = () => {
    this.asInput = React.createRef()
  }

  componentDidUpdate () {
    console.log(this.state)
  }

  componentDidMount () {
    this.focusOnName()
  }

  focusOnName () {
    this.asInput.current.focus()
  }

  save = () => {
    const assoc = formatAssoc(this.state.assoc)
    const errors = validateAssoc(assoc, this.props.assocs, this.props.models)

    if (errors.length > 0) {
      this.setState({ errors })
    } else {
      this.props.onSave({ assoc })
      this.setState({ assoc: emptyAssoc() })
      this.focusOnName()
    }
  }

  cancel = () => {
    this.props.onCancel()
    this.setState({ assoc: emptyAssoc() })
  }

  inputAs = as => this.mapAssoc(assoc => ({ ...assoc, as }))
  selectType = type => this.mapAssoc(assoc => ({ ...assoc, type }))
  selectModel = modelId => this.mapAssoc(assoc => ({ ...assoc, modelId }))

  mapAssoc = fn => {
    const assoc = fn(this.state.assoc)

    const errors =
      this.state.errors.length > 0
        ? validateAssoc(
          formatAssoc(assoc),
          this.props.assocs,
          this.props.models
        )
        : this.state.errors

    this.setState({ assoc, errors })
  }

  render () {
    const { props, state } = this

    return (
      <form
        id='assoc-form'
        className='assoc-form assoc-form'
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
        <div className='assoc-form__item assoc-form__type'>
          <label htmlFor='new-assoc-type'>Type</label>
          <select
            id='new-assoc-type'
            value={state.assoc.type}
            onChange={event => this.selectType(event.target.value)}
          >
            {Object.entries(ASSOC_TYPE_OPTIONS).map(
              ([value, text]) =>
                console.log(value, text) || (
                  <option key={value} value={value}>
                    {text}
                  </option>
                )
            )}
          </select>
        </div>
        <div className='assoc-form__item assoc-form__model'>
          <label htmlFor='new-assoc-model'>Model</label>
          <select
            id='new-assoc-model'
            value={state.assoc.modelId}
            onChange={event => this.selectModel(parseInt(event.target.value))}
          >
            {props.models.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className='assoc-form__item assoc-form__name'>
          <label htmlFor='new-assoc-name'>name</label>
          as
          <input
            ref={this.asInput}
            id='new-assoc-name'
            type='text'
            value={state.assoc.as}
            onChange={event => this.inputAs(event.target.value)}
          />
        </div>
        <div className='assoc-form__item assoc-form__actions'>
          <Button
            primary
            type='submit'
            icon='check'
            className='assoc-form__action'
            label={props.assocId ? 'Update' : 'Add'}
            disabled={state.errors.length > 0}
          />
          <Button
            primary
            type='button'
            icon='cancel'
            className='assoc-form__action'
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

const formatAssoc = assoc => ({
  ...assoc,
  as: assoc.as.trim()
})

const UNIQUE_AS_ERROR = 'UNIQUE_AS_ERROR'
const AS_FORMAT_ERROR = 'AS_FORMAT_ERROR'
const AS_LENGTH_ERROR = 'AS_LENGTH_ERROR'
const REQUIRED_TYPE_ERROR = 'REQUIRED_TYPE_ERROR'

const validateAssoc = (assoc, assocs, models) => {
  const validations = [
    [UNIQUE_AS_ERROR, validators.validateUniqueAssoc(assoc, assocs, models)],
    [AS_FORMAT_ERROR, validators.validateIdentifierFormat(assoc.as)],
    [AS_LENGTH_ERROR, validators.validateIdentifierLength(assoc.as)],
    [REQUIRED_TYPE_ERROR, validators.validateRequired(assoc.type)]
  ]

  return validations.filter(([_, valid]) => !valid).map(([error, _]) => error)
}

const displayErrors = error => {
  switch (error) {
    case UNIQUE_AS_ERROR:
      return 'as already taken.'
    case AS_FORMAT_ERROR:
      return 'as can only contain letters, numbers, spaces, _ or $ and cannot start with a number.'
    case AS_LENGTH_ERROR:
      return `as cannot be more than ${MAX_SQL_IDENTIFIER_LENGTH} characters when converted to snake_case.`
    case REQUIRED_TYPE_ERROR:
      return 'Type is required.'
    default:
      return 'Sorry, something went wront.'
  }
}
