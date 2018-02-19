import React from 'react'

import ModelListItem from './ModelListItem'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Drawer from 'react-toolbox/lib/drawer'
import Input from 'react-toolbox/lib/input'
import { List, ListSubHeader } from 'react-toolbox/lib/list'
import { Button } from 'react-toolbox/lib/button'

/* ----------  HELPERS  ---------- */
const getModelNameObj = models =>
  models.reduce((acc, m) => ({ ...acc, [m.id]: m.name }), {})

/* ----------  COMPONENT  ---------- */
const Sidebar = ({
  // State
  currentId,
  menu,
  models,
  // Actions
  menuActions: {
    updateMenuModelName,
    cancelMenuModel,
    addMenuModel,
    closeMenu
  },
  modelsActions: { removeModel },
  currentModelActions: { receiveModel },
  // Thunks
  modelsThunks: { saveModel }
}) => {
  const modelNameObj = getModelNameObj(models)
  return (
    <Drawer active={menu.isOpen} type='left' onOverlayClick={closeMenu}>
      <h2>Sequelize UI</h2>
      <List>
        <ListSubHeader caption='Models' />
        {models.map(model => (
          <ModelListItem
            key={model.id}
            isCurrent={model.id === currentId}
            modelNameObj={modelNameObj}
            model={model}
            receiveModel={receiveModel.bind(null, model)}
            removeModel={removeModel.bind(null, model.id)}
          />
        ))}
        {menu.newModel && (
          <div>
            <Input
              value={menu.newModel.name || ''}
              onChange={updateMenuModelName}
            />
            <Button
              label='Create'
              onClick={saveModel.bind(null, menu.newModel, models, true)}
            />
            <Button label='Cancel' onClick={cancelMenuModel} />
          </div>
        )}
        {!menu.newModel && (
          <Button icon='add' floating mini onClick={addMenuModel} />
        )}
      </List>
    </Drawer>
  )
}

export default Sidebar
