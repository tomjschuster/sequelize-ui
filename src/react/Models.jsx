import React from 'react'

import { MAX_MODEL_NAME_LENGTH } from '../constants.js'

const Models = ({
  // State
  config,
  models,
  newModel,

  // Actions
  toggleTimestamps,
  toggleSnake,
  toggleSoftDeletes,
  toggleSingularTableNames,
  startCreatingNewModel,
  inputNewModelName,
  cancelCreatingNewModel,
  createModel,
  goToModel,
  editModel,
  deleteModel
}) => (
  <React.Fragment>
    <h2>Models</h2>
    <h3>Configuration</h3>
    <ul>
      <li key='config-timestamps'>
        <label htmlFor='config-timestamps'>Timestamps</label>
        <input
          id='config-timestamps'
          type='checkbox'
          checked={config.timestamps}
          onChange={toggleTimestamps}
        />
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
    {newModel !== null ? (
      <form
        onSubmit={event => {
          event.preventDefault()
          createModel()
        }}
      >
        <strong>New Model</strong>
        <label htmlFor='new-model-name'>Name</label>
        <input
          id='new-model-name'
          type='text'
          value={newModel.name}
          onChange={({ target: { value } }) => inputNewModelName(value)}
          maxLength={MAX_MODEL_NAME_LENGTH}
        />
        {newModel.errors.length > 0 ? (
          <ul>
            {newModel.errors.map(message => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : null}
        <button
          type='submit'
          disabled={
            newModel.name.trim().length === 0 || newModel.errors.length > 0
          }
        >
          Create Model
        </button>
        <button type='button' onClick={cancelCreatingNewModel}>
          Cancel
        </button>
      </form>
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
  </React.Fragment>
)

export default Models
