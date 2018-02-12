import React from 'react'

import ModelListItem from './ModelListItem'
import { List } from 'react-toolbox/lib/list'

const ModelList = ({ models, currentModel }) => (
  <div className="your-models">
    <List>
      <div>
        <h3>{models.length ? 'Your Models' : 'You have no models...'}</h3>
        <h4>{models.length ? 'Click to edit' : 'Create one below'}</h4>
      </div>
      {models.map(model => (
        <ModelListItem
          key={model.id}
          model={model}
          currentModel={currentModel}
          isCurrent={model.id === currentModel.id}
        />
      ))}
    </List>
  </div>
)

export default ModelList
