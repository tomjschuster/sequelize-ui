import React from 'react'

import ModelListItem from './ModelListItem'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import Drawer from 'react-toolbox/lib/drawer'
import { List } from 'react-toolbox/lib/list'

/*----------  HELPERS  ----------*/
const getModelNameObj = models =>
  models.reduce((acc, m) => ({ ...acc, [m.id]: m.name }), {})

/*----------  COMPONENT  ----------*/
const ModelList = ({
  models,
  currentId,
  active,
  receiveModel,
  removeModel,
  close
}) => {
  const modelNameObj = getModelNameObj(models)
  return (
    <Drawer active={active} onOverlayClick={close}>
      <List>
        <h3>{models.length > 0 && 'Your Models'}</h3>
        {models.map(model => (
          <ModelListItem
            key={model.id}
            model={model}
            receiveModel={receiveModel.bind(null, model)}
            removeModel={removeModel.bind(null, model.id)}
            modelNameObj={modelNameObj}
            isCurrent={model.id === currentId}
          />
        ))}
      </List>
    </Drawer>
  )
}

export default ModelList
