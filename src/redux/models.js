import { actionCreators as messages } from './ui'
import { actionCreators as errorsActions } from './errors'
import { exportModel, uid } from '../utils'

/* ----------  HELPERS  ---------- */
const newModel = (id, name) => ({
  id,
  name,
  fields: [],
  config: {
    tableName: '',
    singular: '',
    plural: '',
    timestamps: true,
    freezeTableNames: false,
    underscored: false
  },
  methods: {
    hooks: false,
    getterMethods: false,
    setterMethods: false,
    instanceMethods: false,
    classMethods: false
  },
  associations: []
})

/* ----------  INITIAL STATE  ---------- */
const initialState = {models: [], previewModel: null}

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  RECEIVE: 'MODELS__RECEIVE',
  ADD: 'MODELS__ADD',
  REMOVE: 'MODELS__REMOVE',
  RESET: 'MODELS__RESET',
  UPDATE: 'MODELS__UPDATE',
  PREVIEW_MODEL: 'MODELS__PREVIEW_MODEL',
  CANCEL_PREVIEW_MODEL: 'MODELS__CANCEL_PREVIEW_MODEL'
}

/* ----------  ACTION CREATORS  ---------- */
export const actionCreators = {
  receiveModels: models => ({
    type: Actions.RECEIVE,
    models
  }),

  addModel: (id, name) => ({
    type: Actions.ADD,
    id,
    name
  }),

  updateModel: model => ({
    type: Actions.UPDATE,
    model
  }),

  removeModel: id => ({
    type: Actions.REMOVE,
    id
  }),

  previewModel: id => ({
    type: Actions.PREVIEW_MODEL,
    id
  }),

  cancelPreviewModel: () => ({
    type: Actions.CANCEL_PREVIEW_MODEL
  }),

  reset: () => ({
    type: Actions.RESET
  })
}

/* ----------  THUNKS  ---------- */
export const thunks = {
  createModel: name => (dispatch, getState) => {
    const { models: { models } } = getState()
    let id = uid()
    while (models.find(m => m.id === id)) id = uid()
    console.log(models)
    if (models.find(m => m.name === name)) {
      dispatch(errorsActions.setModelsDuplicateName())
    } else {
      dispatch(actionCreators.addModel(id, name))
    }
  },

  saveModel: (model, models, isNew) => dispatch => {
    let isNameError = models.find(
      ({ id, name }) => name === model.name && id !== model.id
    )
    if (isNameError) return Promise.reject(messages.dupeFieldName)
    if (!model.name) return Promise.reject(messages.reqModelName)

    for (let field of model.fields) {
      if (!field.name) return Promise.reject(messages.reqFieldName)
      if (!field.type) return Promise.reject(messages.reqFieldType)
    }

    for (let association of model.associations) {
      if (!association.relationship) {
        return Promise.reject(messages.reqAssociationRelationship)
      }

      if (!association.target) {
        return Promise.reject(messages.reqAssociationTarget)
      }

      const needsThrough =
        association.relationship === 'belongsToMany' &&
        !association.config.through

      if (needsThrough) return Promise.reject(messages.reqAssociationThrough)
    }

    if (isNew) return Promise.resolve(dispatch(actionCreators.addModel(model)))
    else return Promise.resolve(dispatch(actionCreators.updateModel(model)))
  },

  downloadTemplate: models => () => exportModel(models).catch(console.error)
}

/* ----------  REDUCER  ---------- */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.RECEIVE:
      return { ...state, models: [...action.models] }
    case Actions.ADD:
      return { ...state, models: [...state.models, newModel(action.id, action.name)] }
    case Actions.UPDATE:
      return {
        ...state,
        models: state.models.map(
          model => (model.id === action.model.id ? action.model : model)
        )
      }
    case Actions.REMOVE:
      return {
        ...state,
        models: state.models.filter(model => model.id !== action.id)
      }
    case Actions.PREVIEW_MODEL:
      return { ...state, previewModel: action.id }
    case Actions.CANCEL_PREVIEW_MODEL:
      return { ...state, previewModel: null }
    case Actions.RESET:
      return initialState
    default:
      return state
  }
}
