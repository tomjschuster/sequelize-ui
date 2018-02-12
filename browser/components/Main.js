import React from 'react'
import { connect } from 'react-redux'

/*----------  APP COMPONENTS  ----------*/
import ModelList from './ModelList/ModelList'
import CurrentModel from './CurrentModel/CurrentModel'
import ConfirmDialog from './ConfirmDialog'

/*----------  COMPONENT  ----------*/
const Main = ({ models, currentModel }) => (
  <div>
    <ModelList models={models} currentModel={currentModel} />
    <CurrentModel models={models} currentModel={currentModel} />
    <ConfirmDialog />
  </div>
)

/*----------  CONNECT  ----------*/
const mapStateToProps = ({ models, currentModel }) => ({
  models: models.models,
  currentModel
})

export default connect(mapStateToProps)(Main)
