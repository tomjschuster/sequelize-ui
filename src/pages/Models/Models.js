import React from 'react'

/* ----------  APP COMPONENTS  ---------- */
import ModelCard from './ModelCard'
import NameDialog from './NameDialog'

/* ----------  UI COMPONENTS  ---------- */
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
  errors,
  // Thunks
  gotoModel,
  modelsActions: { removeModel },
  modelsThunks: { createModel },
  formsActions: { inputModelsModelName },
  uiActions: { startCreatingModel, stopCreatingModel },
  errorsActions: { setModelsDuplicateName, resetModelsDuplicateName },
  error
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
      </div>
      <Button icon='add' onClick={startCreatingModel} floating mini />
      <NameDialog
        name={newModelName}
        errors={errors}
        creatingModel={creatingModel}
        createModel={createModel}
        inputModelName={inputModelsModelName}
        stopCreatingModel={stopCreatingModel}
      />
    </div>
  )
}

export default Models
