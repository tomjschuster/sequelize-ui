import React from 'react'

/*----------  APP COMPONENTS  ----------*/
import ModelToolBar from './ModelToolBar'
import Fields from './Fields'
import Configuration from './Configuration'
import Associations from './Associations'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import { Tab, Tabs } from 'react-toolbox'

/*----------  COMPONENT  ----------*/
const CurrentModel = ({
  models,
  currentModel,
  tabIdx,
  fieldsToggle,
  setModelName,
  saveModel,
  removeModel,
  addField,
  updateField,
  updateValidation,
  removeField,
  addAssociation,
  updateTarget,
  updateRelationship,
  updateAssociationConfig,
  removeAssociation,
  updateConfig,
  updateMethod,
  setTabIdx,
  toggleField
}) => (
  <section>
    <h3>Current Model</h3>
    <ModelToolBar
      models={models}
      currentModel={currentModel}
      isNew={!models.find(({ id }) => id === currentModel.id)}
      setModelName={setModelName}
      createModel={saveModel.bind(null, currentModel, models, true)}
      saveModel={saveModel.bind(null, currentModel, models, false)}
      removeModel={removeModel.bind(null, currentModel.id)}
    />
    <Tabs index={tabIdx} onChange={setTabIdx}>
      <Tab label="Fields">
        <Fields
          currentModel={currentModel}
          fieldsToggle={fieldsToggle}
          addField={addField}
          updateField={updateField}
          updateValidation={updateValidation}
          removeField={removeField}
          toggleField={toggleField}
        />
      </Tab>
      <Tab label="Configuration">
        <Configuration
          currentModel={currentModel}
          updateConfig={updateConfig}
          updateMethod={updateMethod}
        />
      </Tab>
      <Tab label="Associations">
        <Associations
          models={models}
          currentModel={currentModel}
          addAssociation={addAssociation}
          updateTarget={updateTarget}
          updateRelationship={updateRelationship}
          updateAssociationConfig={updateAssociationConfig}
          removeAssociation={removeAssociation}
        />
      </Tab>
    </Tabs>
  </section>
)

export default CurrentModel
