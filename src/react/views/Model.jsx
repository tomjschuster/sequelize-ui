import React from 'react'
import PropTypes from 'prop-types'

import * as sequelize4 from '../../templates/sequelize-4.js'
import FieldForm from './Model/FieldForm.jsx'
import ModelNameForm from './Model/ModelNameForm.jsx'

import Button from '../components/Button.jsx'
import ToolBelt from '../components/ToolBelt.jsx'
import { CodeFlyout } from '../components/Code.jsx'
import * as List from '../components/List.jsx'

import { DATA_TYPE_OPTIONS } from '../../constants.js'

export default class Model extends React.Component {
  constructor (props) {
    super(props)

    this.editNameButton = React.createRef()
    this.addButton = React.createRef()
    this.editButtonRef = React.createRef()

    this.props.model.fields.forEach(field => {
      this[`editFieldButton${field.id}`] = React.createRef()
    })

    this.state = {
      editingName: false,
      creatingNewField: false,
      editingFieldId: null,
      codeOpen: false
    }
  }

  componentDidMount () {
    if (this.props.fromEdit) {
      this.editButtonRef.current.focus()
      this.props.clearFromEdit()
    }

    if (this.props.model.fields.length === 0) this.focusOnAddButton()
  }

  focusOnEditNameButton = () => this.editNameButton.current.focus()
  focusOnAddButton = () => this.addButton.current.focus()

  focusOnEditFieldButton = fieldId =>
    this[`editFieldButton${fieldId}`].current.focus()

  startEditingName = () => this.setState({ editingName: true })
  cancelEditingName = () => this.setState({ editingName: false })

  updateModelName = ({ name }) => {
    this.cancelEditingName()
    this.props.updateModelName({ name })
    setTimeout(() => this.focusOnEditNameButton())
  }
  startCreatingNewField = () => this.setState({ creatingNewField: true })

  cancelCreatingNewField = () => {
    this.setState({ creatingNewField: false })
    setTimeout(() => this.focusOnAddButton())
  }

  startEditingField = fieldId => this.setState({ editingFieldId: fieldId })

  cancelEditingField = () => {
    const fieldId = this.state.editingFieldId
    this.setState({ editingFieldId: null })
    setTimeout(() => this.focusOnEditFieldButton(fieldId))
  }

  updateField = ({ field }) => {
    this.cancelEditingField()
    this.props.updateField({ field })
    setTimeout(() => this.focusOnEditFieldButton(field.id))
  }

  toggleCode = () => this.setState({ codeOpen: !this.state.codeOpen })

  codeFileItem = () =>
    sequelize4.modelFile({
      model: this.props.model,
      config: this.props.config
    })

  editing = () =>
    this.state.editingName ||
    !!this.state.editingFieldId ||
    this.state.creatingNewField

  render () {
    const { props, state } = this
    const editing = this.editing()

    return (
      <React.Fragment>
        <main className='main-content model-view'>
          <div className='content-wrapper'>
            {state.editingName ? (
              <ModelNameForm
                modelId={props.model.id}
                name={props.model.name}
                models={props.models}
                onCancel={this.cancelEditingName}
                onSave={this.updateModelName}
              />
            ) : (
              <React.Fragment>
                <h2 className='title'>{props.model.name} Model</h2>
                <Button
                  ref={this.editNameButton}
                  icon='edit'
                  iconPosition='above'
                  onClick={() => this.startEditingName()}
                  label='Edit'
                  disabled={editing}
                />
              </React.Fragment>
            )}
            <ToolBelt>
              <Button
                icon='back'
                label='Back'
                onClick={props.goToModels}
                disabled={editing}
              />
              <Button
                icon='code'
                label='Code'
                onClick={this.toggleCode}
                disabled={editing}
              />
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
                    <div className='fields__item__name'>{field.name}</div>
                    <div
                      className={
                        showFieldOptions(field)
                          ? 'fields__item__type'
                          : 'fields__item__type --no-opts'
                      }
                    >
                      {DATA_TYPE_OPTIONS[field.type]}
                    </div>
                    <div className='fields__item__options'>
                      {showFieldOptions(field)}
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
                    ref={this.addButton}
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
                    ref={this.addButton}
                    icon='add'
                    label='Add a Field'
                    primary
                    onClick={this.startCreatingNewField}
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

Model.propTypes = {
  fromEdit: PropTypes.bool.isRequired,
  clearFromEdit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  goToModels: PropTypes.func.isRequired,
  createField: PropTypes.func.isRequired,
  deleteField: PropTypes.func.isRequired,
  editModel: PropTypes.func.isRequired,
  newMessage: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
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
