import axios from 'axios'
import { openWindow, messages } from './dialog'
import { resetModel as resetCurrentModel } from './currentModel'

/*----------  INITIAL STATE  ----------*/
const initialState = { nextId: 1, models: [] }

/*----------  ACTION TYPES  ----------*/
const RECEIVE_MODELS = 'RECEIVE_MODELS'
const ADD_MODEL = 'ADD_MODEL'
const REMOVE_MODEL = 'REMOVE_MODEL'
const RESET_MODELS = 'RESET_MODELS'
const UPDATE_MODEL = 'UPDATE_MODEL'

/*----------  ACTION CREATORS  ----------*/
export const receiveModels = models => ({
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

export const removeModel = id => ({
  type: REMOVE_MODEL,
  id
})

export const reset = () => ({
  type: RESET_MODELS
})

/*----------  THUNKS  ----------*/
export const saveModel = (models, model, isNew) => dispatch => {
  let isNameError = models.find(
    ({ id, name }) => name === model.name && id !== model.id
  )
  if (isNameError) {
    return dispatch(openWindow('Validation Error', messages.dupFieldName))
  }

  if (!model.name) {
    return dispatch(openWindow('Validation Error', messages.reqModelName))
  }

  for (let field of model.fields) {
    if (!field.name) {
      return dispatch(openWindow('Validation Error', messages.reqFieldName))
    } else if (!field.type) {
      return dispatch(openWindow('Validation Error', messages.reqFieldType))
    }
  }

  for (let association of model.associations) {
    if (!association.relationship) {
      return dispatch(
        openWindow('Validation Error', messages.reqAssociationRelationship)
      )
    } else if (!association.target) {
      return dispatch(
        openWindow('Validation Error', messages.reqAssociationTarget)
      )
    } else if (
      association.relationship === 'belongsToMany' &&
      !association.config.through
    ) {
      return dispatch(
        openWindow('Validation Error', messages.reqAssociationThrough)
      )
    }
  }

  if (isNew) dispatch(addModel(model))
  else dispatch(updateModel(model))
  dispatch(resetCurrentModel())
}

/*----------  FUNCTIONS  ----------*/
export const requestDbDownload = models =>
  axios
    .post('/api/create/db', { models })
    .then(res => window.location.replace(`/api/download/${res.data}`))
    .catch(console.error)

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MODELS:
      return {
        nextId: Math.max(...action.models.map(({ id }) => id)),
        models: action.models
      }
    case ADD_MODEL:
      return {
        nextId: state.nextId + 1,
        models: [...state.models, { ...action.model, id: state.nextId }]
      }
    case UPDATE_MODEL:
      return {
        ...state,
        models: state.models.map(
          model => (model.id === action.model.id ? action.model : model)
        )
      }
    case REMOVE_MODEL:
      return {
        ...state,
        models: state.models.filter(model => model.id !== action.id)
      }
    case RESET_MODELS:
      return initialState
    default:
      return state
  }
}
