import React from 'react'

/* ----------  APP COMPONENTS  ---------- */
import ModelCard from './ModelCard'

/* ----------  HELPERS  ---------- */
const getModelNameObj = models =>
  models.reduce((acc, m) => ({ ...acc, [m.id]: m.name }), {})

/* ----------  COMPONENT  ---------- */
const Models = ({
  // State
  currentId,
  models,
  // Thunks
  gotoModel,
  modelsActions: { removeModel }
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
    </div>
  )
}

export default Models
