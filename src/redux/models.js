import { openDialog, messages } from './ui'
import { resetModel as resetCurrentModel } from './currentModel'
import { exportModel } from '../utils'

/*----------  INITIAL STATE  ----------*/
const initialState = []

/*----------  ACTION TYPES  ----------*/
export const RECEIVE_MODELS = 'RECEIVE_MODELS'
export const ADD_MODEL = 'ADD_MODEL'
export const REMOVE_MODEL = 'REMOVE_MODEL'
export const RESET_MODELS = 'RESET_MODELS'
export const UPDATE_MODEL = 'UPDATE_MODEL'

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
export const saveModel = (model, models, isNew) => dispatch => {
  let isNameError = models.find(
    ({ id, name }) => name === model.name && id !== model.id
  )
  if (isNameError) {
    return dispatch(openDialog('Validation Error', messages.dupFieldName))
  }

  if (!model.name) {
    return dispatch(openDialog('Validation Error', messages.reqModelName))
  }

  for (let field of model.fields) {
    if (!field.name) {
      return dispatch(openDialog('Validation Error', messages.reqFieldName))
    } else if (!field.type) {
      return dispatch(openDialog('Validation Error', messages.reqFieldType))
    }
  }

  for (let association of model.associations) {
    if (!association.relationship) {
      return dispatch(
        openDialog('Validation Error', messages.reqAssociationRelationship)
      )
    } else if (!association.target) {
      return dispatch(
        openDialog('Validation Error', messages.reqAssociationTarget)
      )
    } else if (
      association.relationship === 'belongsToMany' &&
      !association.config.through
    ) {
      return dispatch(
        openDialog('Validation Error', messages.reqAssociationThrough)
      )
    }
  }

  if (isNew) dispatch(addModel(model))
  else dispatch(updateModel(model))
  dispatch(resetCurrentModel())
}

export const downloadTemplate = models => () =>
  exportModel(models).catch(console.error)

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MODELS:
      return [...action.models]
    case ADD_MODEL:
      return [...state, action.model]
    case UPDATE_MODEL:
      return state.map(
        model => (model.id === action.model.id ? action.model : model)
      )
    case REMOVE_MODEL:
      return state.filter(model => model.id !== action.id)
    case RESET_MODELS:
      return initialState
    default:
      return state
  }
}
