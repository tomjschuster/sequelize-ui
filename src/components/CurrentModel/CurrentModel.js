import React from 'react'

/* ----------  APP COMPONENTS  ---------- */
import ModelToolBar from './ModelToolBar'
import Fields from './Fields'
import Configuration from './Configuration'
import Associations from './Associations'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Tab, Tabs } from 'react-toolbox'

/* ----------  COMPONENT  ---------- */
const CurrentModel = ({
  models,
  currentModel,
  tabIdx,
  fieldsToggle,
  modelsActions: { removeModel },
  modelsThunks: { saveModel },
  currentModelActions,
  uiActions
}) => (
  <section>
    <h3>Current Model</h3>
    <ModelToolBar
      isNew={!models.find(({ id }) => id === currentModel.id)}
      name={currentModel.name}
      setModelName={currentModelActions.setModelName}
      createModel={saveModel.bind(null, currentModel, models, true)}
      saveModel={saveModel.bind(null, currentModel, models, false)}
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

export default CurrentModel
