import React from 'react'
import { connect } from 'react-redux'

import ModelList from './ModelList/ModelList'
import CurrentModel from './CurrentModel/CurrentModel'
import ConfirmDialog from './ConfirmDialog'

const Main = ({ models, currentModel }) => (
  <div>
    <ModelList models={models} currentModel={currentModel} />
    <CurrentModel currentModel={currentModel} />
    <ConfirmDialog />
  </div>
)

const mapStateToProps = ({ models, currentModel }) => ({
  models: models.models,
  currentModel
})

export default connect(mapStateToProps)(Main)
