import { Actions as Models } from './models'
import { uid } from '../utils'
import history from '../history'

/* ----------  INITIAL STATE  ---------- */
export const initialState = {
  id: uid(),
  name: '',
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
}

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  RECEIVE: 'CURRENT_MODEL__RECEIVE',
  RESET: 'CURRENT_MODEL__RESET',
  SET_NAME: 'CURRENT_MODEL__SET_NAME',
  ADD_FIELD: 'CURRENT_MODEL__ADD_FIELD',
  UPDATE_FIELD: 'CURRENT_MODEL__UPDATE_FIELD',
  UPDATE_VALIDATION: 'CURRENT_MODEL__UPDATE_VALIDATION',
  REMOVE_FIELD: 'CURRENT_MODEL__REMOVE_FIELD',
  UPDATE_CONFIG: 'CURRENT_MODEL__UPDATE_CONFIG',
  UPDATE_METHOD: 'CURRENT_MODEL__UPDATE_METHOD',
  ADD_ASSOCIATION: 'CURRENT_MODEL__ADD_ASSOCIATION',
  UPDATE_TARGET: 'CURRENT_MODEL__UPDATE_TARGET',
  UPDATE_RELATIONSHIP: 'CURRENT_MODEL__UPDATE_RELATIONSHIP',
  UPDATE_ASSOCIATION_CONFIG: 'CURRENT_MODEL__UPDATE_ASSOCIATION_CONFIG',
  REMOVE_ASSOCIATION: 'CURRENT_MODEL__REMOVE_ASSOCIATION'
}

/* ----------  ACTION CREATORS  ---------- */
export const actionCreators = {
  receiveModel: model => ({
    type: Actions.RECEIVE,
    model
  }),

  resetModel: () => ({
    type: Actions.RESET
  }),

  setModelName: name => ({
    type: Actions.SET_NAME,
    name
  }),

  addField: () => ({
    type: Actions.ADD_FIELD
  }),

  updateField: (id, key, val) => ({
    type: Actions.UPDATE_FIELD,
    key,
    id,
    val
  }),

  updateValidation: (id, key, val) => ({
    type: Actions.UPDATE_VALIDATION,
    key,
    id,
    val
  }),

  removeField: id => ({
    type: Actions.REMOVE_FIELD,
    id
  }),

  updateConfig: (key, val) => ({
    type: Actions.UPDATE_CONFIG,
    key,
    val
  }),

  updateMethod: (key, val) => ({
    type: Actions.UPDATE_METHOD,
    key,
    val
  }),

  addAssociation: () => ({
    type: Actions.ADD_ASSOCIATION
  }),

  updateTarget: (id, target) => ({
    type: Actions.UPDATE_TARGET,
    id,
    target
  }),

  updateRelationship: (id, relationship) => ({
    type: Actions.UPDATE_RELATIONSHIP,
    id,
    relationship
  }),

  updateAssociationConfig: (id, key, val) => ({
    type: Actions.UPDATE_ASSOCIATION_CONFIG,
    id,
    key,
    val
  }),

  removeAssociation: id => ({
    type: Actions.REMOVE_ASSOCIATION,
    id
  })
}

/* ----------  THUNKS  ---------- */
export const thunks = {
  setModel: id => (dispatch, getState) => {
    const currentModel = getState().models.find(model => model.id === id)
    if (currentModel) dispatch(actionCreators.receiveModel(currentModel))
    else history.replace('/')
  }
}

/* ----------  REDUCER  ---------- */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.RECEIVE:
      return action.model.id === state.id ? state : action.model
    case Actions.RESET:
      return { ...initialState, id: uid() }
    case Actions.SET_NAME:
      return { ...state, name: action.name }
    case Actions.ADD_FIELD:
      return {
        ...state,
        fields: [
          ...state.fields,
          { id: uid(), name: '', type: '', validate: {} }
        ]
      }
    case Actions.UPDATE_FIELD:
      return {
        ...state,
        fields: state.fields.map(
          field =>
            field.id === action.id
              ? { ...field, [action.key]: action.val }
              : field
        )
      }
    case Actions.UPDATE_VALIDATION:
      return {
        ...state,
        fields: state.fields.map(
          field =>
            field.id === action.id
              ? {
                ...field,
                validate: { ...field.validate, [action.key]: action.val }
              }
              : field
        )
      }
    case Actions.REMOVE_FIELD:
      return {
        ...state,
        fields: state.fields.filter(({ id }) => id !== action.id)
      }
    case Actions.UPDATE_CONFIG:
      return { ...state, config: { ...state.config, [action.key]: action.val } }
    case Actions.UPDATE_METHOD:
      return {
        ...state,
        methods: { ...state.methods, [action.key]: action.val }
      }
    case Actions.ADD_ASSOCIATION:
      return {
        ...state,
        associations: [
          ...state.associations,
          { id: uid(), target: null, relationship: null, config: {} }
        ]
      }
    case Actions.UPDATE_RELATIONSHIP:
      return {
        ...state,
        associations: state.associations.map(
          assoc =>
            assoc.id === action.id
              ? { ...assoc, relationship: action.relationship }
              : assoc
        )
      }
    case Actions.UPDATE_TARGET:
      return {
        ...state,
        associations: state.associations.map(
          assoc =>
            assoc.id === action.id ? { ...assoc, target: action.target } : assoc
        )
      }
    case Actions.UPDATE_ASSOCIATION_CONFIG:
      return {
        ...state,
        associations: state.associations.map(
          assoc =>
            assoc.id === action.id
              ? {
                ...assoc,
                config: { ...assoc.config, [action.key]: action.val }
              }
              : assoc
        )
      }
    case Actions.REMOVE_ASSOCIATION:
      return {
        ...state,
        associations: state.associations.filter(({ id }) => id !== action.id)
      }
    case Models.REMOVE:
      return action.id === state.id ? initialState : state
    default:
      return state
  }
}
