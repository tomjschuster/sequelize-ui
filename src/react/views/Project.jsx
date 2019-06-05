import React from 'react'
import PropTypes from 'prop-types'

import * as sequelize4 from '../../templates/sequelize-4.js'
import NewModelForm from './Project/NewModelForm.jsx'
import Checkbox from '../components/Checkbox.jsx'
import Button from '../components/Button.jsx'
import ToolBelt from '../components/ToolBelt.jsx'
import { CodeFlyout } from '../components/Code.jsx'
import * as List from '../components/List.jsx'

export default class Project extends React.Component {
  constructor (props) {
    super(props)
    this.addButton = React.createRef()
    this.state = { codeOpen: false }
  }

  componentDidMount () {
    if (this.props.models.length === 0) this.focusOnAddButton()
  }

  componentWillUnmount () {
    this.props.cancelCreatingNewModel()
  }

  focusOnAddButton () {
    this.addButton.current.focus()
  }

  toggleCode = () => this.setState({ codeOpen: !this.state.codeOpen })

  render () {
    const {
      // State
      config,
      models,
      creatingNewModel,

      // Actions
      toggleTimestamps,
      toggleSnake,
      toggleSingularTableNames,
      startCreatingNewModel,
      cancelCreatingNewModel,
      createModel,
      goToModel,
      editModel,
      deleteModel
    } = this.props

    return (
      <React.Fragment>
        <main className='main-content project'>
          <div className='content-wrapper'>
            <h2 className='title'>My Sequelize Project</h2>
            <ToolBelt>
              <Button icon='code' label='Code' onClick={this.toggleCode} />
            </ToolBelt>
            <List.Title className='models__title' text='Models' />
            <List.List className='models'>
              {models.map(model => (
                <List.Item key={model.id}>
                  <List.Content>{model.name}</List.Content>
                  <List.Actions>
                    <Button
                      icon='view'
                      iconPosition='above'
                      onClick={() => goToModel(model.id)}
                      label='View'
                    />
                    <Button
                      icon='edit'
                      iconPosition='above'
                      onClick={() => editModel(model.id)}
                      label='Edit'
                    />
                    <Button
                      icon='delete'
                      iconPosition='above'
                      onClick={() => deleteModel(model.id)}
                      label='Delete'
                    />
                  </List.Actions>
                </List.Item>
              ))}
              <List.Item className='add-model'>
                {creatingNewModel ? (
                  <NewModelForm
                    models={models}
                    onCancel={cancelCreatingNewModel}
                    onCreate={createModel}
                  />
                ) : models.length > 0 ? (
                  <Button
                    ref={this.addButton}
                    icon='add'
                    label='Add a Model'
                    primary
                    onClick={startCreatingNewModel}
                  />
                ) : (
                  <React.Fragment>
                    <p>You have no models</p>
                    <Button
                      ref={this.addButton}
                      icon='add'
                      label='Add a Model'
                      primary
                      onClick={startCreatingNewModel}
                    />
                  </React.Fragment>
                )}
              </List.Item>
            </List.List>
            <ToolBelt className='model-config' title='Database Options'>
              <Checkbox
                id='config-timestamps'
                className='model-config__item'
                label='Timestamps'
                checked={config.timestamps}
                onCheck={toggleTimestamps}
              />
              <Checkbox
                id='config-snake'
                className='model-config__item'
                label='snake_case'
                checked={config.snake}
                onCheck={toggleSnake}
              />
              <Checkbox
                id='singluar-table-names'
                className='model-config__item'
                label='Singular Table Names'
                checked={config.singularTableNames}
                onCheck={toggleSingularTableNames}
              />
            </ToolBelt>
          </div>
        </main>
        <CodeFlyout
          project
          open={this.state.codeOpen}
          onClose={this.toggleCode}
          newMessage={this.props.newMessage}
          fileItem={sequelize4.files({ models, config })}
        />
      </React.Fragment>
    )
  }
}

Project.propTypes = {
  config: PropTypes.object.isRequired,
  models: PropTypes.arrayOf(PropTypes.object.isRequired),
  creatingNewModel: PropTypes.bool.isRequired,

  // Actions
  toggleTimestamps: PropTypes.func.isRequired,
  toggleSnake: PropTypes.func.isRequired,
  toggleSingularTableNames: PropTypes.func.isRequired,
  startCreatingNewModel: PropTypes.func.isRequired,
  cancelCreatingNewModel: PropTypes.func.isRequired,
  createModel: PropTypes.func.isRequired,
  goToModel: PropTypes.func.isRequired,
  editModel: PropTypes.func.isRequired,
  deleteModel: PropTypes.func.isRequired
}
