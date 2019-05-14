import React from 'react'

import * as sequelize4 from '../../templates/sequelize-4.js'
import NewModelForm from '../forms/NewModelForm.jsx'
import Checkbox from '../components/Checkbox.jsx'
import Button from '../components/Button.jsx'
import ToolBelt from '../components/ToolBelt.jsx'
import { CodeFlyout } from '../components/Code.jsx'

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
            <h3 className='models__title list__title'>Models</h3>
            <ul className='models list'>
              {models.map(model => (
                <li className='models__item list__item' key={model.id}>
                  <span className='list__item__content'>{model.name}</span>
                  <span className='models__item__actions list__item__actions'>
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
                  </span>
                </li>
              ))}
              <li className='add-model list__item'>
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
              </li>
            </ul>
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
          rootFileItem={sequelize4.files({ models, config })}
        />
      </React.Fragment>
    )
  }
}
