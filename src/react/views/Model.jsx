import React from 'react'
import PropTypes from 'prop-types'

import * as sequelize4 from '../../templates/sequelize-4.js'
import FieldForm from './Model/FieldForm.jsx'

import Button from '../components/Button.jsx'
import ToolBelt from '../components/ToolBelt.jsx'
import { CodeFlyout } from '../components/Code.jsx'
import * as List from '../components/List.jsx'

import { DATA_TYPE_OPTIONS } from '../../constants.js'

export default class Model extends React.Component {
  constructor (props) {
    super(props)

    this.addButton = React.createRef()
    this.editButtonRef = React.createRef()

    this.props.model.fields.forEach(field => {
      this[`editFieldButton${field.id}`] = React.createRef()
    })

    this.state = {
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

  focusOnAddButton () {
    this.addButton.current.focus()
  }

  focusOnEditFieldButton (fieldId) {
    this[`editFieldButton${fieldId}`].current.focus()
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

  render () {
    return (
      <React.Fragment>
        <main className='main-content model-view'>
          <div className='content-wrapper'>
            <h2 className='title'>{this.props.model.name} Model</h2>
            <ToolBelt>
              <Button
                icon='back'
                label='Back'
                onClick={this.props.goToModels}
              />
              <Button
                ref={this.editButtonRef}
                icon='edit'
                label='Edit'
                onClick={this.props.editModel}
              />
              <Button icon='code' label='Code' onClick={this.toggleCode} />
            </ToolBelt>
            <List.Title className='fields__title' text='Fields' />
            <List.List className='fields'>
              {this.props.model.fields.map(field =>
                field.id === this.state.editingFieldId ? (
                  <List.Item className='edit-field' key={field.id}>
                    <FieldForm
                      fields={this.props.model.fields}
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
                        disabled={
                          this.state.creatingNewField ||
                          !!this.state.editingFieldId
                        }
                      />
                      <Button
                        icon='delete'
                        iconPosition='above'
                        onClick={() => this.props.deleteField(field.id)}
                        label='Delete'
                        disabled={
                          this.state.creatingNewField ||
                          !!this.state.editingFieldId
                        }
                      />
                    </div>
                  </List.Item>
                )
              )}
              {this.state.creatingNewField ? (
                <List.Item className='new-field'>
                  <FieldForm
                    fields={this.props.model.fields}
                    onSave={this.props.createField}
                    onCancel={this.cancelCreatingNewField}
                  />
                </List.Item>
              ) : this.props.model.fields.length === 0 ? (
                <List.Item className='add-field'>
                  <p>You have no fields</p>
                  <Button
                    ref={this.addButton}
                    icon='add'
                    label='Add a Field'
                    primary
                    onClick={this.startCreatingNewField}
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
                    disabled={!!this.state.editingFieldId}
                  />
                </List.Item>
              )}
            </List.List>
          </div>
        </main>
        <CodeFlyout
          open={this.state.codeOpen}
          onClose={this.toggleCode}
          newMessage={this.props.newMessage}
          fileItem={sequelize4.modelFile({
            model: this.props.model,
            config: this.props.config
          })}
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
