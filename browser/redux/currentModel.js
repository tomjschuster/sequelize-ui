'use strict'

import { getInitialModel, copyModel } from '../utils'
import { findIndex, find } from 'lodash'

/*----------  INITIAL STATE  ----------*/
const initialState =  {
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
const RESET_MODEL = 'RESET_MODEL'
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
const UPDATE_ASSOCIATION_CONFIG  = 'UPDATE_ASSOCIATION_CONFIG'
const REMOVE_ASSOCIATION = 'REMOVE_ASSOCIATION'

/*----------  ACTION CREATORS  ----------*/
export const receiveModel = model => ({
  type: RECEIVE_MODEL,
  model
})

export const resetModel = () => ({
  type: RESET_MODEL,
})

export const setModelName = name  => ({
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
  let model = copyModel(state)
  let association, idx
  switch (action.type) {
    case RECEIVE_MODEL:
      return copyModel(action.model)
    case RESET_MODEL:
      return getInitialModel()
    case SET_MODEL_NAME:
      console.log('reducing, setting name', action, model)
      model.name = action.name
      console.log('returning', model)
      return model
    case ADD_FIELD:
      model.fields.push({name: '', type: '', validate: {}})
      return model
    case UPDATE_FIELD:
      model.fields[action.idx][action.key] = action.val
      return model
    case UPDATE_VALIDATION:
      model.fields[action.idx].validate[action.key] = action.val
      return model
    case REMOVE_FIELD:
      model.fields.splice(action.idx, 1)
      return model
    case UPDATE_CONFIG:
      model.config[action.key] = action.val
      return model
    case UPDATE_METHOD:
      model.methods[action.key] = action.val
      return model
    case ADD_ASSOCIATION:
      model.associations = [...model.associations,
        {target: null, relationship: null, config: {} }
      ]
      return model
    case UPDATE_RELATIONSHIP:
      model.associations[action.idx].relationship = action.relationship
      return model
    case UPDATE_TARGET:
      model.associations[action.idx].target = action.target
      return model
    case UPDATE_ASSOCIATION_CONFIG:
      model.associations[action.idx].config[action.key] = action.val
      return model
    case REMOVE_ASSOCIATION:
      if (action.idx + 1) model.associations.splice(action.idx, 1)
      return model
    default:
      return state
  }
}
