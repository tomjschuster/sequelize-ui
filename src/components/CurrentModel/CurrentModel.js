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
  addField,
  updateField,
  updateValidation,
  removeField,
  setTabIdx,
  toggleField
}) => (
  <section>
    <h3>Current Model</h3>
    <ModelToolBar
      models={models}
      currentModel={currentModel}
      isNew={!models.find(({ id }) => id === currentModel.id)}
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
        <Configuration />
      </Tab>
      <Tab label="Associations">
        <Associations />
      </Tab>
    </Tabs>
  </section>
)

export default CurrentModel
