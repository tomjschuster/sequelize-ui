import { REMOVE_MODEL } from './models'
import { guid } from '../utils'

/*----------  INITIAL STATE  ----------*/
export const initialState = {
  id: guid(),
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
export const RECEIVE_MODEL = 'RECEIVE_MODEL'
export const RESET_MODEL = 'RESET_MODEL'
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

export const resetModel = () => ({
  type: RESET_MODEL
})

export const setModelName = name => ({
  type: SET_MODEL_NAME,
  name
})

export const addField = () => ({
  type: ADD_FIELD
})

export const updateField = (id, key, val) => ({
  type: UPDATE_FIELD,
  key,
  id,
  val
})

export const updateValidation = (id, key, val) => ({
  type: UPDATE_VALIDATION,
  key,
  id,
  val
})

export const removeField = id => ({
  type: REMOVE_FIELD,
  id
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

export const updateTarget = (id, target) => ({
  type: UPDATE_TARGET,
  id,
  target
})

export const updateRelationship = (id, relationship) => ({
  type: UPDATE_RELATIONSHIP,
  id,
  relationship
})

export const updateAssociationConfig = (id, key, val) => ({
  type: UPDATE_ASSOCIATION_CONFIG,
  id,
  key,
  val
})

export const removeAssociation = id => ({
  type: REMOVE_ASSOCIATION,
  id
})

/*----------  THUNKS  ----------*/

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MODEL:
      return action.model.id === state.id ? state : action.model
    case RESET_MODEL:
      return { ...initialState, id: guid() }
    case SET_MODEL_NAME:
      return { ...state, name: action.name }
    case ADD_FIELD:
      return {
        ...state,
        fields: [
          ...state.fields,
          { id: guid(), name: '', type: '', validate: {} }
        ]
      }
    case UPDATE_FIELD:
      return {
        ...state,
        fields: state.fields.map(
          field =>
            field.id === action.id
              ? { ...field, [action.key]: action.val }
              : field
        )
      }
    case UPDATE_VALIDATION:
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
    case REMOVE_FIELD:
      return {
        ...state,
        fields: state.fields.filter(({ id }) => id !== action.id)
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
          { id: guid(), target: null, relationship: null, config: {} }
        ]
      }
    case UPDATE_RELATIONSHIP:
      return {
        ...state,
        associations: state.associations.map(
          assoc =>
            assoc.id === action.id
              ? { ...assoc, relationship: action.relationship }
              : assoc
        )
      }
    case UPDATE_TARGET:
      return {
        ...state,
        associations: state.associations.map(
          assoc =>
            assoc.id === action.id ? { ...assoc, target: action.target } : assoc
        )
      }
    case UPDATE_ASSOCIATION_CONFIG:
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
    case REMOVE_ASSOCIATION:
      return {
        ...state,
        associations: state.associations.filter(({ id }) => id !== action.id)
      }
    case REMOVE_MODEL:
      return action.id === state.id ? initialState : state
    default:
      return state
  }
}
