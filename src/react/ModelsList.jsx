import React from 'react'

import NewModelForm from './NewModelForm.jsx'
import Checkbox from './Checkbox.jsx'
import Button from './Button.jsx'
import ToolBelt from './ToolBelt.jsx'

const ModelsList = ({
  // State
  config,
  models,
  creatingNewModel,

  // Actions
  toggleTimestamps,
  toggleSnake,
  toggleSoftDeletes,
  toggleSingularTableNames,
  startCreatingNewModel,
  cancelCreatingNewModel,
  createModel,
  goToModel,
  editModel,
  deleteModel
}) => (
  <main className='main-content models-list'>
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
          <Button label='Add a Model' primary onClick={startCreatingNewModel} />
        ) : (
          <React.Fragment>
            <p>You have no models</p>
            <Button
              label='Add a Model'
              primary
              onClick={startCreatingNewModel}
            />
          </React.Fragment>
        )}
      </li>
    </ul>
    <ToolBelt className='model-config' title='Options'>
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
        label='Snake'
        checked={config.snake}
        onCheck={toggleSnake}
      />
      <Checkbox
        id='config-soft-deletes'
        className='model-config__item'
        label='Soft Deletes'
        checked={config.softDeletes}
        onCheck={toggleSoftDeletes}
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

export default ModelsList
