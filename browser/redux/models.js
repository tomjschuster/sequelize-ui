/*----------  INITIAL STATE  ----------*/
const initialState = [];

/*----------  ACTION TYPES  ----------*/
const RECEIVE_MODELS = 'RECEIVE_MODELS';
const ADD_MODEL = 'ADD_MODEL';
const REMOVE_MODEL = 'REMOVE_MODEL';
const RESET_MODELS = 'RESET_MODELS';

/*----------  ACTION CREATORS  ----------*/
export const receiveModels = models  => ({
  type: RECEIVE_MODELS,
  models
});

export const addModel = model => ({
  type: ADD_MODEL,
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

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MODELS:
      return action.models;
    case ADD_MODEL:
      return [...state, action.model];
    case REMOVE_MODEL:
      let models = [...state];
      let idx = models.indexOf(action.model);
      if (idx === -1) models.splice(idx, 1);
      return models;
    case RESET_MODELS:
      return [];
    default:
      return state;
  }
}
