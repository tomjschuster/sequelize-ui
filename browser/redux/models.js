'use strict'

import axios from 'axios'
import { find } from 'lodash'
import { openWindow, messages } from './dialog'
import { resetModel } from './currentModel'
import store from '../store'

/*----------  INITIAL STATE  ----------*/
const initialState = []

/*----------  ACTION TYPES  ----------*/
const RECEIVE_MODELS = 'RECEIVE_MODELS'
const ADD_MODEL = 'ADD_MODEL'
const REMOVE_MODEL = 'REMOVE_MODEL'
const RESET_MODELS = 'RESET_MODELS'
const UPDATE_MODEL = 'UPDATE_MODEL'

/*----------  ACTION CREATORS  ----------*/
export const receiveModels = models  => ({
  type: RECEIVE_MODELS,
  models
})

export const addModel = model => ({
  type: ADD_MODEL,
  model
})

export const updateModel = model => ({
  type: UPDATE_MODEL,
  model
})

export const removeModel = model => ({
  type: REMOVE_MODEL,
  model
})

export const resetModels = () => ({
  type: RESET_MODELS
})

/*----------  THUNKS  ----------*/
export const saveModel = (model, isNew) => dispatch => {
  let { models } = store.getState()
  let storeModel = find(models, {name: model.name})
  console.log('storeModel', storeModel)
  if (storeModel && storeModel.id !== model.id) {
    dispatch(openWindow('Validation Error', messages.dupFieldName))
    return
  }

  if (!model.name) {
      dispatch(openWindow('Validation Error', messages.reqModelName))
      return
  }

  for (let field of model.fields) {
    if (!field.name) {
      dispatch(openWindow('Validation Error', messages.reqFieldName))
      return
    } else if (!field.type) {
      dispatch(openWindow('Validation Error', messages.reqFieldType))
      return
    }
  }

  for (let association of model.associations) {
    if (!association.relationship) {
      dispatch(openWindow('Validation Error', messages.reqAssociationRelationship))
      return
    } else if (!association.target) {
      dispatch(openWindow('Validation Error', messages.reqAssociationTarget))
      return
    } else if (association.relationship === 'belongsToMany' && !association.config.through) {
      dispatch(openWindow('Validation Error', messages.reqAssociationThrough))
      return
    }
  }

  if (isNew) dispatch(addModel(model))
  else dispatch(updateModel(model))
  dispatch(resetModel())
}

/*----------  FUNCTIONS  ----------*/
export const requestDbDownload = models =>  axios.post('/api/create/db', {models}).then(res => {
  console.log(res.data)
  window.location.replace(`/api/download/${res.data}`)
}).catch(console.error)


/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  let models = []
  state.forEach((model, idx) => { models[idx] = Object.assign({}, model) })
  switch (action.type) {
    case RECEIVE_MODELS:
      return action.models
    case ADD_MODEL:
      let id = models.reduce((prev, curr) => prev < curr.id ? curr.id : prev, 0) + 1
      let model = Object.assign({}, action.model, {id})
      return [...state, model]
    case UPDATE_MODEL:
      models.forEach((model, idx) => {
        if (model.id === action.model.id) models[idx] = action.model
      })
      return models
    case REMOVE_MODEL:
      let idx = models.reduce((prev, curr, i) =>
        prev === -1 && curr.id === action.model.id ? curr.id : prev, -1)
      if (idx !== -1) models.splice(action.idx, 1)
      return models
    case RESET_MODELS:
      return []
    default:
      return state
  }
}
