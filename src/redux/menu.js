import { Actions as Models } from './models'
import {
  Actions as CurrentModel,
  initialState as currentModelInitialState
} from './currentModel'
import { uid } from '../utils'

/* ----------  INITIAL STATE  ---------- */
const initialState = { isOpen: false, newModelName: null }

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  OPEN_MENU: 'OPEN_MENU',
  CLOSE_MENU: 'CLOSE_MENU',
  TOGGLE_MENU: 'TOGGLE_MENU',
  ADD_MENU_MODEL: 'ADD_MENU_MODEL',
  UPDATE_MENU_MODEL_NAME: 'UPDATE_MENU_MODEL_NAME',
  CANCEL_MENU_MODEL: 'CANCEL_MENU_MODEL'
}

/* ----------  ACTION CREATORS  ---------- */
export const actionCreators = {
  openMenu: () => ({
    type: Actions.OPEN_MENU
  }),

  closeMenu: () => ({
    type: Actions.CLOSE_MENU
  }),

  toggleMenu: () => ({
    type: Actions.TOGGLE_MENU
  }),

  addMenuModel: () => ({
    type: Actions.ADD_MENU_MODEL
  }),

  updateMenuModelName: name => ({
    type: Actions.UPDATE_MENU_MODEL_NAME,
    name
  }),

  cancelMenuModel: () => ({
    type: Actions.CANCEL_MENU_MODEL
  })
}

/* ----------  THUNKS  ---------- */

/* ----------  REDUCER  ---------- */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.OPEN_MENU:
      return { ...state, isOpen: true }
    case Actions.CLOSE_MENU:
    case CurrentModel.RECEIVE:
      return { ...state, isOpen: false, newModelName: null }
    case Actions.TOGGLE_MENU:
      return { ...state, isOpen: !state.isOpen }
    case Actions.ADD_MENU_MODEL:
      return { ...state, newModelName: '' }
    case Actions.UPDATE_MENU_MODEL_NAME:
      return { ...state, newModelName: action.name }
    case Actions.CANCEL_MENU_MODEL:
      return { ...state, newModelName: null }
    case Models.ADD:
      return { ...state, newModelName: null }
    default:
      return state
  }
}
