import { actionCreators as uiActions, messages } from './ui'
import { actionCreators as currentModelActions } from './currentModel'
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
    underscored: false,
    underscoredAll: false
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

  reset: () => ({
    type: Actions.RESET
  })
}

/* ----------  THUNKS  ---------- */
export const thunks = {
  createModel: name => (dispatch, getState) => {
    let id = uid()
    while (getState().models.find(m => m.id === id)) id = uid()
    dispatch(actionCreators.addModel(id, name))
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
      return [...action.models]
    case Actions.ADD:
      return [...state, newModel(action.id, action.name)]
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
