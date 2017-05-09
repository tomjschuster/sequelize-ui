'use strict'

import { combineReducers } from 'redux'
import models from './models'
import currentModel from './currentModel'
import dialog from './dialog'

export default combineReducers({
  models,
  currentModel,
  dialog
})
