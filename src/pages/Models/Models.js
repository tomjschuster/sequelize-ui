import React from 'react'

/* ----------  APP COMPONENTS  ---------- */
import ModelCard from './ModelCard'

/* ----------  UI COMPONENTS  ---------- */
import Input from 'react-toolbox/lib/input'
import { Button } from 'react-toolbox/lib/button'

/* ----------  HELPERS  ---------- */
const getModelNameObj = models =>
  models.reduce((acc, m) => ({ ...acc, [m.id]: m.name }), {})

/* ----------  COMPONENT  ---------- */
const Models = ({
  // State
  currentId,
  models,
  creatingModel,
  newModelName,
  // Thunks
  gotoModel,
  modelsActions: { removeModel },
  modelsThunks: { createModel },
  formsActions: { inputModelsModelName },
  uiActions: { startCreatingModel, stopCreatingModel }
}) => {
  const modelNameObj = getModelNameObj(models)
  return (
    <div>
      <h2>Models</h2>
      <div>
        {models.map(model => (
          <ModelCard
            key={model.id}
            isCurrent={model.id === currentId}
            modelNameObj={modelNameObj}
            model={model}
            gotoModel={gotoModel.bind(null, model.id)}
            removeModel={removeModel.bind(null, model.id)}
          />
        ))}
        {creatingModel ? (
          <div>
            <Input value={newModelName} onChange={inputModelsModelName} />
            <Button
              onClick={createModel.bind(null, newModelName)}
              label='Create'
            />
          </div>
        ) : (
          <Button icon='add' onClick={startCreatingModel} floating mini />
        )}
      </div>
    </div>
  )
}

export default Models
