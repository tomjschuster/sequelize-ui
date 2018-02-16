import React from 'react'

import ModelListItem from './ModelListItem'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import Drawer from 'react-toolbox/lib/drawer'
import { List, ListSubHeader } from 'react-toolbox/lib/list'
import { Button } from 'react-toolbox/lib/button'

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
    <Drawer active={active} type="left" onOverlayClick={close}>
      <h2>Sequelize UI</h2>
      <List>
        <ListSubHeader caption="Models" />
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
        <Button icon="add" floating mini />
      </List>
    </Drawer>
  )
}

export default ModelList
