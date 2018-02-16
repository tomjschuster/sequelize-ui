import React from 'react'

import ModelListItem from './ModelListItem'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import Drawer from 'react-toolbox/lib/drawer'
import Input from 'react-toolbox/lib/input'
import { List, ListSubHeader } from 'react-toolbox/lib/list'
import { Button } from 'react-toolbox/lib/button'

/*----------  HELPERS  ----------*/
const getModelNameObj = models =>
  models.reduce((acc, m) => ({ ...acc, [m.id]: m.name }), {})

/*----------  COMPONENT  ----------*/
const ModelList = ({
  models,
  menu,
  currentId,
  active,
  receiveModel,
  removeModel,
  close,
  addModel,
  updateModelName,
  cancelModel,
  saveModel
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
        {menu.newModel && (
          <div>
            <Input
              value={menu.newModel.name || ''}
              onChange={updateModelName}
            />
            <Button
              label="Create"
              onClick={saveModel.bind(null, menu.newModel, models, true)}
            />
            <Button label="Cancel" onClick={cancelModel} />
          </div>
        )}
        {!menu.newModel && (
          <Button icon="add" floating mini onClick={addModel} />
        )}
      </List>
    </Drawer>
  )
}

export default ModelList
