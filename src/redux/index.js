import { combineReducers } from 'redux'
import models from './models'
import currentModel from './currentModel'
import ui from './ui'

export default combineReducers({
  models,
  currentModel,
  ui
})
