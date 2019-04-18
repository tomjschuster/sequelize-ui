import React from 'react'

import * as sequelize4 from '../templates/sequelize-4.js'
import NewModelForm from './NewModelForm.jsx'
import Checkbox from './Checkbox.jsx'
import Button from './Button.jsx'
import ToolBelt from './ToolBelt.jsx'
import { CodeExplorer } from './Code.jsx'

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
      <main className='main-content project'>
        <h2 className='title'>My Sequelize Project</h2>
        <ToolBelt className='project__code-belt'>
          <Button
            icon='down-arrow'
            label='Download'
            onClick={this.props.exportModels}
          />
          <Button icon='code' label='code' onClick={this.toggleCode} />
        </ToolBelt>
        {this.state.codeOpen ? (
          <div className='project-code'>
            <CodeExplorer rootFileItem={sequelize4.files({ models, config })} />
          </div>
        ) : null}
        <h3 className='models__title list__title'>Models</h3>
        <ul className='models list'>
          {models.map(model => (
            <li className='models__item list__item' key={model.id}>
              <span className='list__item__content'>{model.name}</span>
              <span className='models__item__actions list__item__actions'>
                <Button
                  icon='right-arrow'
                  iconPosition='under'
                  onClick={() => goToModel(model.id)}
                  label='Go'
                />
                <Button
                  icon='left-pencil'
                  iconPosition='under'
                  onClick={() => editModel(model.id)}
                  label='Edit'
                />
                <Button
                  icon='multiplication-sign'
                  iconPosition='under'
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
                label='Add a Model'
                primary
                onClick={startCreatingNewModel}
              />
            ) : (
              <React.Fragment>
                <p>You have no models</p>
                <Button
                  ref={this.addButton}
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
      </main>
    )
  }
}
