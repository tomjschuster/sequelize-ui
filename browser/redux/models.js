'use strict';

import axios from 'axios';

/*----------  INITIAL STATE  ----------*/
const initialState = [];

/*----------  ACTION TYPES  ----------*/
const RECEIVE_MODELS = 'RECEIVE_MODELS';
const ADD_MODEL = 'ADD_MODEL';
const REMOVE_MODEL = 'REMOVE_MODEL';
const RESET_MODELS = 'RESET_MODELS';
const UPDATE_MODEL = 'UPDATE_MODEL';

/*----------  ACTION CREATORS  ----------*/
export const receiveModels = models  => ({
  type: RECEIVE_MODELS,
  models
});

export const addModel = model => ({
  type: ADD_MODEL,
  model
});

export const updateModel = model => ({
  type: UPDATE_MODEL,
  model
});

export const removeModel = model => ({
  type: REMOVE_MODEL,
  model
});

export const resetModels = () => ({
  type: RESET_MODELS
});

/*----------  THUNKS  ----------*/

/*----------  FUNCTIONS  ----------*/
export const requestDbDownload = models =>  axios.post('/api/create/db', {models}).then(res => {
  console.log(res.data);
  window.location.replace(`/api/download/${res.data}`);
}).catch(console.error);


/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  let models = [...state];
  switch (action.type) {
    case RECEIVE_MODELS:
      return action.models;
    case ADD_MODEL:
      let id = models.reduce((prev, curr) => prev < curr.id ? curr.id : prev, 1) + 1;
      let model = Object.assign({}, action.model, {id});
      return [...state, model];
    case UPDATE_MODEL:
      models.forEach((model, idx) => {
        if (model.id === action.model.id) models[idx] = action.model;
      });
      return models;
    case REMOVE_MODEL:
      let idx = models.reduce((prev, curr, i) =>
        prev === -1 && curr.id === action.model.id ? curr.id : prev, -1);
      if (idx !== -1) models.splice(action.idx, 1);
      return models;
    case RESET_MODELS:
      return [];
    default:
      return state;
  }
};
