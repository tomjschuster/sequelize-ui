import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'

import * as validators from '../../../utils/validators.js'

import {
  MAX_SQL_IDENTIFIER_LENGTH,
  ASSOC_TYPES,
  ASSOC_TYPE_OPTIONS
} from '../../../constants.js'

import Button from '../../components/Button.jsx'

const emptyAssoc = (sourceId, targetId) => ({
  id: uuid(),
  type: ASSOC_TYPES.BELONGS_TO,
  sourceId,
  targetId,
  name: '',
  through: '',
  foreignKey: '',
  targetForeignKey: ''
})

export default class AssocForm extends React.Component {
  static propTypes = {
    modelId: PropTypes.string,
    models: PropTypes.arrayOf(PropTypes.object).isRequired,
    assocId: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  }

  state = {
    assoc:
      this.props.assocs.find(f => f.id === this.props.assocId) ||
      this.newAssoc(),
    errors: []
  }

  constructor (props) {
    super(props)

    this.createRefs()
  }

  createRefs = () => {
    this.nameInput = React.createRef()
  }

  componentDidUpdate (prevProps, prevState) {
    const changedFromManyToMany =
      prevState.assoc.type === ASSOC_TYPES.MANY_TO_MANY &&
      this.state.assoc.type !== ASSOC_TYPES.MANY_TO_MANY
    if (changedFromManyToMany) {
      this.mapAssoc(assoc => ({
        ...assoc,
        through: null,
        targetForeignKey: null
      }))
    }
  }

  componentDidMount () {
    this.focusOnName()
  }

  focusOnName () {
    this.nameInput.current && this.nameInput.current.focus()
  }

  newAssoc () {
    return emptyAssoc(this.props.modelId, this.props.models[0].id)
  }

  save = () => {
    const assoc = formatAssoc(this.state.assoc)
    const errors = validateAssoc(assoc, this.props.assocs, this.props.models)

    if (errors.length > 0) {
      this.setState({ errors })
    } else {
      this.props.onSave({ assoc })
      this.setState({ assoc: this.newAssoc() })
      this.focusOnName()
    }
  }

  cancel = () => {
    this.props.onCancel()
    this.setState({ assoc: this.newAssoc() })
  }

  inputName = name => this.mapAssoc(assoc => ({ ...assoc, name }))
  selectType = type => this.mapAssoc(assoc => ({ ...assoc, type }))
  selectModel = targetId => this.mapAssoc(assoc => ({ ...assoc, targetId }))
  inputThrough = through => this.mapAssoc(assoc => ({ ...assoc, through }))
  inputForeignKey = foreignKey =>
    this.mapAssoc(assoc => ({ ...assoc, foreignKey }))
  inputTargetForeignKey = targetForeignKey =>
    this.mapAssoc(assoc => ({ ...assoc, targetForeignKey }))

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
          <select
            id='new-assoc-type'
            value={state.assoc.type}
            onChange={event => this.selectType(event.target.value)}
          >
            {Object.entries(ASSOC_TYPE_OPTIONS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div className='assoc-form__item assoc-form__model'>
          <select
            id='new-assoc-model'
            value={state.assoc.targetId}
            onChange={event => this.selectModel(event.target.value)}
          >
            {props.models.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className='assoc-form__item assoc-form__name'>
          <label htmlFor='new-assoc-name'>as</label>
          <input
            ref={this.nameInput}
            id='new-assoc-name'
            type='text'
            value={state.assoc.name || ''}
            onChange={event => this.inputName(event.target.value)}
          />
        </div>
        <div className='assoc-form__item assoc-form__foreign-key'>
          <label htmlFor='new-assoc-foreign-key'>FK</label>
          <input
            id='new-assoc-foreign-key'
            type='text'
            value={state.assoc.foreignKey || ''}
            onChange={event => this.inputForeignKey(event.target.value)}
          />
        </div>
        {this.state.assoc.type === ASSOC_TYPES.MANY_TO_MANY ? (
          <>
            <div className='assoc-form__item assoc-form__through'>
              <label htmlFor='new-assoc-through'>Through</label>
              <input
                id='new-assoc-through'
                type='text'
                value={state.assoc.through || ''}
                onChange={event => this.inputThrough(event.target.value)}
              />
            </div>
            <div className='assoc-form__item assoc-form__target-foreign-key'>
              <label htmlFor='new-assoc-target-foreign-key'>Target FK</label>
              <input
                id='new-assoc-target-foreign-key'
                type='text'
                value={state.assoc.targetForeignKey || ''}
                onChange={event =>
                  this.inputTargetForeignKey(event.target.value)
                }
              />
            </div>
          </>
        ) : null}
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
          <ul className='assoc-form__errors'>
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
  name: trimAndNullify(assoc.name),
  through: trimAndNullify(assoc.through),
  foreignKey: trimAndNullify(assoc.foreignKey),
  targetForeignKey: trimAndNullify(assoc.targetForeignKey)
})

const UNIQUE_ASSOC_ERROR = 'UNIQUE_ASSOC_ERROR'
const NAME_FORMAT_ERROR = 'NAME_FORMAT_ERROR'
const NAME_LENGTH_ERROR = 'NAME_LENGTH_ERROR'
const REQUIRED_TYPE_ERROR = 'REQUIRED_TYPE_ERROR'
const REQUIRED_THROUGH_ERROR = 'REQUIRED_THROUGH_ERROR'

const validateAssoc = (assoc, assocs, models) => {
  const validations = [
    [UNIQUE_ASSOC_ERROR, validators.validateUniqueAssoc(assoc, assocs, models)],
    [NAME_FORMAT_ERROR, validators.validateIdentifierFormat(assoc.name)],
    [NAME_LENGTH_ERROR, validators.validateIdentifierLength(assoc.name)],
    [REQUIRED_TYPE_ERROR, validators.validateRequired(assoc.type)],
    [
      REQUIRED_THROUGH_ERROR,
      assoc.type === ASSOC_TYPES.MANY_TO_MANY
        ? validators.validateRequired(assoc.through)
        : true
    ]
  ]

  return validations.filter(([_, valid]) => !valid).map(([error, _]) => error)
}

const trimAndNullify = value => (value ? value.trim() || null : null)

const displayErrors = error => {
  switch (error) {
    case UNIQUE_ASSOC_ERROR:
      return 'assoc already taken.'
    case NAME_FORMAT_ERROR:
      return 'name can only contain letters, numbers, spaces, _ or $ and cannot start with a number.'
    case NAME_LENGTH_ERROR:
      return `name cannot be more than ${MAX_SQL_IDENTIFIER_LENGTH} characters when converted to snake_case.`
    case REQUIRED_TYPE_ERROR:
      return 'Type is required.'
    case REQUIRED_THROUGH_ERROR:
      return 'Through is required for many to many relationships.'
    default:
      return 'Sorry, something went wront.'
  }
}
