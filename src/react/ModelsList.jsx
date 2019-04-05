import React from 'react'

import NewModelForm from './NewModelForm.jsx'
import BreadCrumbs from './BreadCrumbs.jsx'
import Checkbox from './Checkbox.jsx'

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
    <BreadCrumbs crumbs={[{ text: 'Sequelize UI' }]} />
    <h2 className='title'>Models</h2>
    <h3>Configuration</h3>
    <ul>
      <li key='config-timestamps'>
        <Checkbox id='config-timestamps' label='Timestamps' checked={config.timestamps} onCheck={toggleTimestamps} />
      </li>
      <li key='config-snake'>
        <label htmlFor='config-snake'>Snake Case</label>
        <input
          id='config-snake'
          type='checkbox'
          checked={config.snake}
          onChange={toggleSnake}
        />
      </li>
      <li key='config-soft-deletes'>
        <label htmlFor='config-soft-deletes'>Soft Deletes</label>
        <input
          id='config-soft-deletes'
          type='checkbox'
          checked={config.softDeletes}
          onChange={toggleSoftDeletes}
        />
      </li>
      <li key='config-singular-tableNames'>
        <label htmlFor='config-singular-tableNames'>Singular Table Names</label>
        <input
          id='config-singular-tableNames'
          type='checkbox'
          checked={config.singularTableNames}
          onChange={toggleSingularTableNames}
        />
      </li>
    </ul>
    {creatingNewModel ? (
      <NewModelForm
        models={models}
        onCancel={cancelCreatingNewModel}
        onCreate={createModel}
      />
    ) : (
      <button onClick={startCreatingNewModel}>Add a Model</button>
    )}
    <ul>
      {models.map(model => (
        <li key={model.id}>
          {model.name}
          <button onClick={() => goToModel(model.id)}>View</button>
          <button onClick={() => editModel(model.id)}>Edit</button>
          <button onClick={() => deleteModel(model.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </main>
)

export default ModelsList
