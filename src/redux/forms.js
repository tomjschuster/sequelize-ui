import { Actions as Models } from './models'

/* ----------  INITIAL STATE  ---------- */
const initialState = {
  models: { newModelName: '' }
}

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  INPUT_MODELS_MODEL_NAME: 'INPUT_MODELS_MODEL_NAME',
  RESET_MODELS_MODEL_NAME: 'RESET_MODELS_MODEL_NAME'
}

/* ----------  ACTION CREATORS  ---------- */
export const actionCreators = {
  inputModelsModelName: name => ({
    type: Actions.INPUT_MODELS_MODEL_NAME,
    name
  }),

  resetModelsModelName: () => ({
    type: Actions.RESET_MODELS_MODEL_NAME
  })
}

/* ----------  THUNKS  ---------- */

/* ----------  REDUCER  ---------- */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.INPUT_MODELS_MODEL_NAME:
      return {
        ...state,
        models: { ...state.models, newModelName: action.name }
      }
    case Actions.RESET_MODELS_MODEL_NAME:
    case Models.ADD:
      return { ...state, models: { ...state.models, newModelName: '' } }
    default:
      return state
  }
}
