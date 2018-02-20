import React from 'react'

/* ----------  APP COMPONENTS  ---------- */
import ModelToolBar from './ModelToolBar'
import Fields from './Fields'
import Configuration from './Configuration'
import Associations from './Associations'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Tab, Tabs } from 'react-toolbox'

/* ----------  COMPONENT  ---------- */
const SingleModel = ({
  // State
  isNew,
  tabIdx,
  fieldsToggle,
  models,
  currentModel,
  // Actions
  uiActions,
  currentModelActions,
  modelsActions: { removeModel },
  // Thunks]
  createModel,
  saveModel
}) => (
  <section>
    {isNew ? <h3>Create a Model</h3> : <h3>Edit a Model</h3>}
    <ModelToolBar
      isNew={isNew}
      name={currentModel.name}
      setModelName={currentModelActions.setModelName}
      createModel={createModel}
      saveModel={saveModel}
      removeModel={removeModel.bind(null, currentModel.id)}
    />
    <Tabs index={tabIdx} onChange={uiActions.setCurrentModelTabIdx}>
      <Tab label='Fields'>
        <Fields
          fields={currentModel.fields}
          fieldsToggle={fieldsToggle}
          currentModelActions={currentModelActions}
          uiActions={uiActions}
        />
      </Tab>
      <Tab label='Configuration'>
        <Configuration
          config={currentModel.config}
          methods={currentModel.methods}
          currentModelActions={currentModelActions}
        />
      </Tab>
      <Tab label='Associations'>
        <Associations
          models={models}
          associations={currentModel.associations}
          currentModelActions={currentModelActions}
        />
      </Tab>
    </Tabs>
  </section>
)

export default SingleModel
