import { openDialog, messages } from './ui'
import { resetModel as resetCurrentModel } from './currentModel'
import { exportModel } from '../utils'

/* ----------  INITIAL STATE  ---------- */
const initialState = []

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  RECEIVE: 'MODELS__RECEIVE',
  ADD: 'MODELS__ADD',
  REMOVE: 'MODELS__REMOVE',
  RESET: 'MODELS__RESET',
  UPDATE: 'MODELS__UPDATE'
}

/* ----------  ACTION CREATORS  ---------- */
export const actionCreators = {
  receiveModels: models => ({
    type: Actions.RECEIVE,
    models
  }),

  addModel: model => ({
    type: Actions.ADD,
    model
  }),

  updateModel: model => ({
    type: Actions.UPDATE,
    model
  }),

  removeModel: id => ({
    type: Actions.REMOVE,
    id
  }),

  reset: () => ({
    type: Actions.RESET
  })
}

/* ----------  THUNKS  ---------- */
export const thunks = {
  saveModel: (model, models, isNew) => dispatch => {
    console.log('we here', model, models, isNew)
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

    if (isNew) dispatch(actionCreators.addModel(model))
    else dispatch(actionCreators.updateModel(model))
    dispatch(resetCurrentModel())
  },

  downloadTemplate: models => () => exportModel(models).catch(console.error)
}

/* ----------  REDUCER  ---------- */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.RECEIVE:
      return [...action.models]
    case Actions.ADD:
      return [...state, action.model]
    case Actions.UPDATE:
      return state.map(
        model => (model.id === action.model.id ? action.model : model)
      )
    case Actions.REMOVE:
      return state.filter(model => model.id !== action.id)
    case Actions.RESET:
      return initialState
    default:
      return state
  }
}
