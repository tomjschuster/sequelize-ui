import { REMOVE_MODEL } from './models'

/*----------  INITIAL STATE  ----------*/
const initialState = {
  id: 1,
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

/*----------  ACTION TYPES  ----------*/
const RECEIVE_MODEL = 'RECEIVE_MODEL'
const RESET_CURRENT_MODEL = 'RESET_CURRENT_MODEL'
const SET_MODEL_NAME = 'SET_MODEL_NAME'
const ADD_FIELD = 'ADD_FIELD'
const UPDATE_FIELD = 'UPDATE_FIELD'
const UPDATE_VALIDATION = 'UPDATE_VALIDATION'
const REMOVE_FIELD = 'REMOVE_FIELD'
const UPDATE_CONFIG = 'UPDATE_CONFIG'
const UPDATE_METHOD = 'UPDATE_METHOD'
const ADD_ASSOCIATION = 'ADD_ASSOCIATION'
const UPDATE_TARGET = 'UPDATE_TARGET'
const UPDATE_RELATIONSHIP = 'UPDATE_RELATIONSHIP'
const UPDATE_ASSOCIATION_CONFIG = 'UPDATE_ASSOCIATION_CONFIG'
const REMOVE_ASSOCIATION = 'REMOVE_ASSOCIATION'

/*----------  ACTION CREATORS  ----------*/
export const receiveModel = model => ({
  type: RECEIVE_MODEL,
  model
})

export const resetModel = nextId => ({
  type: RESET_CURRENT_MODEL,
  nextId
})

export const setModelName = name => ({
  type: SET_MODEL_NAME,
  name
})

export const addField = () => ({
  type: ADD_FIELD
})

export const updateField = (key, val, idx) => ({
  type: UPDATE_FIELD,
  key,
  val,
  idx
})

export const updateValidation = (key, val, idx) => ({
  type: UPDATE_VALIDATION,
  key,
  val,
  idx
})

export const removeField = idx => ({
  type: REMOVE_FIELD,
  idx
})

export const updateConfig = (key, val) => ({
  type: UPDATE_CONFIG,
  key,
  val
})

export const updateMethod = (key, val) => ({
  type: UPDATE_METHOD,
  key,
  val
})

export const addAssociation = () => ({
  type: ADD_ASSOCIATION
})

export const updateTarget = (target, idx) => ({
  type: UPDATE_TARGET,
  target,
  idx
})

export const updateRelationship = (relationship, idx) => ({
  type: UPDATE_RELATIONSHIP,
  relationship,
  idx
})

export const updateAssociationConfig = (key, val, idx) => ({
  type: UPDATE_ASSOCIATION_CONFIG,
  key,
  val,
  idx
})

export const removeAssociation = idx => ({
  type: REMOVE_ASSOCIATION,
  idx
})

/*----------  THUNKS  ----------*/

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MODEL:
      return action.model.id === state.id ? state : action.model
    case RESET_CURRENT_MODEL:
      return { ...initialState, id: action.nextId }
    case SET_MODEL_NAME:
      return { ...state, name: action.name }
    case ADD_FIELD:
      return {
        ...state,
        fields: [...state.fields, { name: '', type: '', validate: {} }]
      }
    case UPDATE_FIELD:
      return {
        ...state,
        fields: state.fields.map(
          (field, idx) =>
            idx === action.idx ? { ...field, [action.key]: action.val } : field
        )
      }
    case UPDATE_VALIDATION:
      return {
        ...state,
        fields: state.fields.map(
          (field, idx) =>
            idx === action.idx
              ? {
                  ...field,
                  validate: { ...field.validate, [action.key]: action.val }
                }
              : field
        )
      }
    case REMOVE_FIELD:
      return {
        ...state,
        fields: state.fields.filter((_, idx) => idx !== action.idx)
      }
    case UPDATE_CONFIG:
      return { ...state, config: { ...state.config, [action.key]: action.val } }
    case UPDATE_METHOD:
      return {
        ...state,
        methods: { ...state.methods, [action.key]: action.val }
      }
    case ADD_ASSOCIATION:
      return {
        ...state,
        associations: [
          ...state.associations,
          { target: null, relationship: null, config: {} }
        ]
      }
    case UPDATE_RELATIONSHIP:
      return {
        ...state,
        associations: state.associations.map(
          (assoc, idx) =>
            idx === action.idx
              ? { ...assoc, relationship: action.relationship }
              : assoc
        )
      }
    case UPDATE_TARGET:
      return {
        ...state,
        associations: state.associations.map(
          (assoc, idx) =>
            idx === action.idx ? { ...assoc, target: action.target } : assoc
        )
      }
    case UPDATE_ASSOCIATION_CONFIG:
      return {
        ...state,
        associations: state.associations.map(
          (assoc, idx) =>
            idx === action.idx
              ? {
                  ...assoc,
                  config: { ...assoc.config, [action.key]: action.val }
                }
              : assoc
        )
      }
    case REMOVE_ASSOCIATION:
      return {
        ...state,
        associations: state.associations.filter((_, idx) => idx !== action.idx)
      }
    case REMOVE_MODEL:
      return action.id === state.id ? initialState : state
    default:
      return state
  }
}
