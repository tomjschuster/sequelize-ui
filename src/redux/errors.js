import { Actions as Models } from './models'
/* ----------  MESSAGE  ---------- */
const NAME_TAKEN = 'Model already exists with name.'

/* ----------  INITIAL STATE  ---------- */
const initialState = {
  models: { duplicateName: { error: false, message: '' } }
}

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  SET_MODELS_DUPLICATE_NAME: 'SET_MODELS_DUPLICATE_NAME',
  RESET_MODELS_DUPLICATE_NAME: 'RESET_MODELS_DUPLICATE_NAME'
}

/* ----------  ACTION CREATORS  ---------- */
export const actionCreators = {
  setModelsDuplicateName: () => ({
    type: Actions.SET_MODELS_DUPLICATE_NAME
  }),

  resetModelsDuplicateName: () => ({
    type: Actions.RESET_MODELS_DUPLICATE_NAME
  })
}

/* ----------  THUNKS  ---------- */

/* ----------  REDUCER  ---------- */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_MODELS_DUPLICATE_NAME:
      return {
        ...state,
        models: { duplicateName: { error: true, message: NAME_TAKEN } }
      }
    case Actions.RESET_MODELS_DUPLICATE_NAME:
    case Models.SET_MODELS_DUPLICATE_NAME:
      return {
        ...state,
        models: { duplicateName: { error: false, message: '' } }
      }
    default:
      return state
  }
}
