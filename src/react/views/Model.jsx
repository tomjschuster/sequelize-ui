import React from 'react'
import PropTypes from 'prop-types'

import * as sequelize4 from '../../templates/sequelize-4.js'
import Button from '../components/Button.jsx'
import ToolBelt from '../components/ToolBelt.jsx'
import { CodeFlyout } from '../components/Code.jsx'
import * as List from '../components/List.jsx'

import { DATA_TYPE_OPTIONS } from '../../constants.js'

export default class Model extends React.Component {
  constructor (props) {
    super(props)
    this.editButtonRef = React.createRef()
    this.state = { codeOpen: false }
  }

  componentDidMount () {
    if (this.props.fromEdit) {
      this.editButtonRef.current.focus()
      this.props.clearFromEdit()
    }
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
              {this.props.model.fields.length === 0 ? (
                <List.Item>
                  <p>No Fields</p>
                </List.Item>
              ) : (
                this.props.model.fields.map(field => (
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
                        icon='edit'
                        iconPosition='above'
                        // onClick={() => editModel(model.id)}
                        label='Edit'
                      />
                      <Button
                        icon='delete'
                        iconPosition='above'
                        // onClick={() => deleteModel(model.id)}
                        label='Delete'
                      />
                    </div>
                  </List.Item>
                ))
              )}
              <List.Item className='add-model'>
                <Button
                  // ref={this.addButton}
                  icon='add'
                  label='Add a Field'
                  primary
                  // onClick={startCreatingNewModel}
                />
              </List.Item>
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
