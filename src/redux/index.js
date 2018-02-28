import { combineReducers } from 'redux'
import models from './models'
import menu from './menu'
import currentModel from './currentModel'
import ui from './ui'
import forms from './forms'
import errors from './errors'

export default combineReducers({
  models,
  menu,
  currentModel,
  ui,
  forms,
  errors
})
