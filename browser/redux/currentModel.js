'use strict';

import { getInitialModel, copyModel } from '../utils';

/*----------  INITIAL STATE  ----------*/
const initialState =  {
  idx: -1,
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
  }
  }

/*----------  ACTION TYPES  ----------*/
const RECEIVE_MODEL = 'RECEIVE_MODEL';
const RESET_MODEL = 'RESET_MODEL';
const UPDATE_MODEL_NAME = 'UPDATE_MODEL_NAME';
const ADD_FIELD = 'ADD_FIELD';
const UPDATE_FIELD = 'UPDATE_FIELD';
const UPDATE_VALIDATION = 'UPDATE_VALIDATION';
const DELETE_FIELD = 'DELETE_FIELD';
const UPDATE_CONFIG = 'UPDATE_CONFIG';
const UPDATE_METHOD = 'UPDATE_METHOD';

/*----------  ACTION CREATORS  ----------*/
export const receiveModel = model => ({
  type: RECEIVE_MODEL,
  model
});

export const resetModel = () => ({
  type: RESET_MODEL,
});

export const updateModelName = name  => ({
  type: UPDATE_MODEL_NAME,
  name
});

export const addField = () => ({
  type: ADD_FIELD
});

export const updateField = (key, val, idx) => ({
  type: UPDATE_FIELD,
  key,
  val,
  idx
});

export const updateValidation = (key, val, idx) => ({
  type: UPDATE_VALIDATION,
  key,
  val,
  idx
});

export const deleteField = idx => ({
  type: DELETE_FIELD,
  idx
});

export const updateConfig = (key, val) => ({
  type: UPDATE_CONFIG,
  key,
  val
});

export const updateMethod = (key, val) => ({
  type: UPDATE_METHOD,
  key,
  val
});

/*----------  THUNKS  ----------*/

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  let model = copyModel(state);
  console.log('reducing', model.fields);
  switch (action.type) {
    case RECEIVE_MODEL:
      return copyModel(action.model);
    case RESET_MODEL:
      return getInitialModel();
    case UPDATE_MODEL_NAME:
      model.name = action.name;
      return model;
    case ADD_FIELD:
      model.fields.push([{name: '', type: '', validate: {}}]);
      return model;
    case UPDATE_FIELD:
      model.fields[action.idx][action.key] = action.val;
      return model;
    case UPDATE_VALIDATION:
    console.log(action)
      model.fields[action.idx].validate[action.key] = action.val;
      return model;
    case DELETE_FIELD:
      model.fields.splice(action.idx, 1);
      return model;
    case UPDATE_CONFIG:
      model.config[action.key] = action.val;
      return model;
    case UPDATE_METHOD:
      model.methods[action.key] = action.val;
      return model;
    default:
      return state;
  }
};
