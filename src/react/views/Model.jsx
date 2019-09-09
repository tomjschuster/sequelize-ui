import React from 'react'
import PropTypes from 'prop-types'

import * as sequelize4 from '../../templates/sequelize-4.js'
import AssocForm from './Model/AssocForm.jsx'
import FieldForm from './Model/FieldForm.jsx'
import ModelNameForm from './Model/ModelNameForm.jsx'

import Button from '../components/Button.jsx'
import ToolBelt from '../components/ToolBelt.jsx'
import { CodeFlyout } from '../components/Code.jsx'
import * as List from '../components/List.jsx'

import { DATA_TYPE_OPTIONS, ASSOC_TYPE_OPTIONS } from '../../constants.js'

export default class Model extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    models: PropTypes.arrayOf(PropTypes.object).isRequired,
    config: PropTypes.object.isRequired,
    goToModel: PropTypes.func.isRequired,
    goToProject: PropTypes.func.isRequired,
    updateModelName: PropTypes.func.isRequired,
    createField: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
    deleteField: PropTypes.func.isRequired,
    createAssoc: PropTypes.func.isRequired,
    updateAssoc: PropTypes.func.isRequired,
    deleteAssoc: PropTypes.func.isRequired,
    newMessage: PropTypes.func.isRequired
  }

  state = {
    editingName: false,
    creatingNewField: false,
    editingFieldId: null,
    creatingNewAssoc: false,
    editingAssocId: null,
    codeOpen: false
  }

  constructor (props) {
    super(props)

    this.createRefs()
  }

  createRefs = () => {
    this.editNameButton = React.createRef()
    this.addFieldButton = React.createRef()
    this.addAssocButton = React.createRef()
    this.createFieldRefs()
    this.createAssocRefs()
  }

  createFieldRefs = () => {
    this.props.model.fields.forEach(field => this.createFieldRef(field))
  }

  createFieldRef = ({ id }) => {
    if (!this[`editFieldButton${id}`]) { this[`editFieldButton${id}`] = React.createRef() }
  }

  createAssocRefs = () => {
    this.props.model.assocs.forEach(assoc => this.createAssocRef(assoc))
  }

  createAssocRef = ({ id }) => {
    if (!this[`editAssocButton${id}`]) { this[`editAssocButton${id}`] = React.createRef() }
  }

  componentDidUpdate (prevProps, prevState) {
    console.log(this.state)
    if (prevState.editingName && !this.state.editingName) {
      this.focusOnEditNameButton()
    }

    if (prevState.creatingNewField && !this.state.creatingNewField) {
      const fieldAdded =
        prevProps.model.fields.length < this.props.model.fields.length

      if (fieldAdded) this.createFieldRefs()
      else this.focusOnAddFieldButton()
    }

    if (prevState.editingFieldId && !this.state.editingFieldId) {
      this.focusOnEditFieldButton(prevState.editingFieldId)
    }

    if (prevState.creatingNewAssoc && !this.state.creatingNewAssoc) {
      const assocAdded =
        prevProps.model.assocs.length < this.props.model.assocs.length

      if (assocAdded) this.createAssocRefs()
      else this.focusOnAddAssocButton()
    }

    if (prevState.editingAssocId && !this.state.editingAssocId) {
      this.focusOnEditAssocButton(prevState.editingAssocId)
    }
  }

  componentDidMount () {
    if (this.props.model.fields.length === 0) this.focusOnAddFieldButton()
  }

  // Focus Helpers
  focusOnEditNameButton = () => this.editNameButton.current.focus()
  focusOnAddFieldButton = () => this.addFieldButton.current.focus()
  focusOnAddAssocButton = () => this.addAssocButton.current.focus()

  focusOnEditFieldButton = fieldId =>
    this[`editFieldButton${fieldId}`].current.focus()

  focusOnEditAssocButton = assocId =>
    this[`editAssocButton${assocId}`].current.focus()

  // Model Name
  startEditingName = () => this.setState({ editingName: true })
  cancelEditingName = () => this.setState({ editingName: false })

  updateModelName = ({ name }) => {
    this.cancelEditingName()
    this.props.updateModelName({ name })
  }

  // New Field
  startCreatingNewField = () => this.setState({ creatingNewField: true })
  cancelCreatingNewField = () => this.setState({ creatingNewField: false })

  // Edit Field
  startEditingField = fieldId => this.setState({ editingFieldId: fieldId })
  cancelEditingField = () => this.setState({ editingFieldId: null })

  updateField = ({ field }) => {
    this.cancelEditingField()
    this.props.updateField({ field })
  }

  // New Assoc
  startCreatingNewAssoc = () => this.setState({ creatingNewAssoc: true })
  cancelCreatingNewAssoc = () => this.setState({ creatingNewAssoc: false })

  // Edit Assoc
  startEditingAssoc = assocId => this.setState({ editingAssocId: assocId })
  cancelEditingAssoc = () => this.setState({ editingAssocId: null })

  updateAssoc = ({ assoc }) => {
    this.cancelEditingAssoc()
    this.props.updateAssoc({ assoc })
  }

  // Code
  toggleCode = () => this.setState({ codeOpen: !this.state.codeOpen })

  codeFileItem = () =>
    sequelize4.modelFile({
      model: this.props.model,
      config: this.props.config
    })

  editing = () =>
    this.state.editingName ||
    !!this.state.editingFieldId ||
    this.state.creatingNewField ||
    !!this.state.editingAssocId ||
    this.state.creatingNewAssoc

  render () {
    const { props, state } = this
    const editing = this.editing()

    return (
      <React.Fragment>
        <main className='main-content model-view'>
          <div className='content-wrapper'>
            <h2 className='title'>Model Details</h2>
            <ToolBelt>
              <Button
                icon='back'
                label='Back'
                onClick={props.goToProject}
                disabled={editing}
              />
              <Button
                icon='code'
                label='Code'
                onClick={this.toggleCode}
                disabled={editing}
              />
            </ToolBelt>
            <ToolBelt className='model-name' title='Name'>
              {state.editingName ? (
                <ModelNameForm
                  modelId={props.model.id}
                  name={props.model.name}
                  models={props.models}
                  onCancel={this.cancelEditingName}
                  onSave={this.updateModelName}
                />
              ) : (
                <div className='model-name__view'>
                  <h4 className='model-name__text'>{props.model.name}</h4>
                  <Button
                    ref={this.editNameButton}
                    className='model-name__edit'
                    icon='edit'
                    iconPosition='above'
                    onClick={() => this.startEditingName()}
                    label='Edit'
                    disabled={editing}
                  />
                </div>
              )}
            </ToolBelt>
            <List.Title className='fields__title' text='Fields' />
            <List.List className='fields'>
              {props.model.fields.map(field =>
                field.id === state.editingFieldId ? (
                  <List.Item className='edit-field' key={field.id}>
                    <FieldForm
                      fields={props.model.fields}
                      fieldId={field.id}
                      onSave={this.updateField}
                      onCancel={this.cancelEditingField}
                    />
                  </List.Item>
                ) : (
                  <List.Item className='fields__item' key={field.id}>
                    <div className='fields__item__details'>
                      <div className='fields__item__name'>{field.name}</div>
                      <div className='fields__item__info'>
                        <div className='fields__item__type'>
                          {DATA_TYPE_OPTIONS[field.type]}
                        </div>
                        {hasOptions(field) ? (
                          <div className='fields__item__options'>
                            {showFieldOptions(field)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className='fields__item__actions list__item__actions'>
                      <Button
                        ref={this[`editFieldButton${field.id}`]}
                        icon='edit'
                        iconPosition='above'
                        onClick={() => this.startEditingField(field.id)}
                        label='Edit'
                        disabled={editing}
                      />
                      <Button
                        icon='delete'
                        iconPosition='above'
                        onClick={() => props.deleteField(field.id)}
                        label='Delete'
                        disabled={editing}
                      />
                    </div>
                  </List.Item>
                )
              )}
              {state.creatingNewField ? (
                <List.Item className='new-field'>
                  <FieldForm
                    fields={props.model.fields}
                    onSave={props.createField}
                    onCancel={this.cancelCreatingNewField}
                  />
                </List.Item>
              ) : props.model.fields.length === 0 ? (
                <List.Item className='add-field'>
                  <p>You have no fields</p>
                  <Button
                    ref={this.addFieldButton}
                    icon='add'
                    label='Add a Field'
                    primary
                    onClick={this.startCreatingNewField}
                    disabled={editing}
                  />
                </List.Item>
              ) : (
                <List.Item className='add-field'>
                  <Button
                    ref={this.addFieldButton}
                    icon='add'
                    label='Add a Field'
                    primary
                    onClick={this.startCreatingNewField}
                    disabled={editing}
                  />
                </List.Item>
              )}
            </List.List>
            <List.Title className='assocs__title' text='Associations' />
            <List.List className='assocs'>
              {props.model.assocs.map(assoc =>
                assoc.id === state.editingAssocId ? (
                  <List.Item className='edit-assoc' key={assoc.id}>
                    <AssocForm
                      models={props.models}
                      assocs={props.model.assocs}
                      assocId={assoc.id}
                      onSave={this.updateAssoc}
                      onCancel={this.cancelEditingAssoc}
                    />
                  </List.Item>
                ) : (
                  <List.Item className='assocs__item' key={assoc.id}>
                    <div className='assocs__item__description'>
                      <span className='assocs__item__name'>
                        {ASSOC_TYPE_OPTIONS[assoc.type]}{' '}
                        <strong
                          className='assocs__item__target'
                          onClick={() => this.props.goToModel(assoc.modelId)}
                        >
                          {props.models.find(m => m.id === assoc.modelId).name}
                        </strong>
                      </span>
                      {assoc.as ? (
                        <span className='assocs__item__alias'>
                          {' as ' + assoc.as}
                        </span>
                      ) : null}
                    </div>
                    <div className='assocs__item__actions list__item__actions'>
                      <Button
                        ref={this[`editAssocButton${assoc.id}`]}
                        icon='edit'
                        iconPosition='above'
                        onClick={() => this.startEditingAssoc(assoc.id)}
                        label='Edit'
                        disabled={editing}
                      />
                      <Button
                        icon='delete'
                        iconPosition='above'
                        onClick={() => props.deleteAssoc(assoc.id)}
                        label='Delete'
                        disabled={editing}
                      />
                    </div>
                  </List.Item>
                )
              )}
              {state.creatingNewAssoc ? (
                <List.Item className='new-field'>
                  <AssocForm
                    models={props.models}
                    assocs={props.model.assocs}
                    onSave={props.createAssoc}
                    onCancel={this.cancelCreatingNewAssoc}
                  />
                </List.Item>
              ) : props.model.assocs.length === 0 ? (
                <List.Item className='add-assoc'>
                  <p>You have no assocs</p>
                  <Button
                    icon='add'
                    label='Add an Assoc'
                    primary
                    onClick={this.startCreatingNewAssoc}
                    disabled={editing}
                  />
                </List.Item>
              ) : (
                <List.Item className='add-assoc'>
                  <Button
                    ref={this.addAssocButton}
                    icon='add'
                    label='Add an Assoc'
                    primary
                    onClick={this.startCreatingNewAssoc}
                    disabled={editing}
                  />
                </List.Item>
              )}
            </List.List>
          </div>
        </main>
        <CodeFlyout
          open={state.codeOpen}
          onClose={this.toggleCode}
          newMessage={props.newMessage}
          fileItem={this.codeFileItem()}
        />
      </React.Fragment>
    )
  }
}

const hasOptions = field => {
  const options = {
    primaryKey: 'PK',
    required: 'REQ',
    unique: 'UQ'
  }

  return Object.keys(options).some(opt => field[opt])
}

const showFieldOptions = field => {
  const options = {
    primaryKey: 'PK',
    required: 'REQ',
    unique: 'UQ'
  }

  const display = Object.entries(options)
    .filter(([option, _]) => field[option])
    .map(([_, text]) => text)
    .join(', ')

  return display
}
