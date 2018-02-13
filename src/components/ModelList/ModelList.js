import React from 'react'

import ModelListItem from './ModelListItem'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import { List } from 'react-toolbox/lib/list'

/*----------  HELPERS  ----------*/
const getModelNameObj = models =>
  models.reduce((acc, m) => ({ ...acc, [m.id]: m.name }), {})

/*----------  COMPONENT  ----------*/
const ModelList = ({ models, currentId, receiveModel, removeModel }) => {
  const modelNameObj = getModelNameObj(models)
  return (
    <div className="your-models">
      <List>
        <h3>{models.length > 0 && 'Your Models'}</h3>
        {models.map(model => (
          <ModelListItem
            key={model.id}
            model={model}
            receiveModel={receiveModel}
            removeModel={removeModel}
            modelNameObj={modelNameObj}
            isCurrent={model.id === currentId}
          />
        ))}
      </List>
    </div>
  )
}

export default ModelList
