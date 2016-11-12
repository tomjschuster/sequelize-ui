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

export const updateModel = (model, idx) => ({
  type: UPDATE_MODEL,
  idx,
  model
});

export const removeModel = idx => ({
  type: REMOVE_MODEL,
  idx
});

export const resetModels = () => ({
  type: RESET_MODELS
});

/*----------  THUNKS  ----------*/

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
      if ((action.idx >= 0) && (action.idx < models.length)) {
        models[action.idx] = action.model;
      }
      return models;
    case REMOVE_MODEL:
      if ((action.idx >= 0) && (action.idx < models.length)) {
        models.splice(action.idx, 1);
      }
      return models;
    case RESET_MODELS:
      return [];
    default:
      return state;
  }
};
