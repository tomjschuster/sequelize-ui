import { Actions as Models } from './models'
import { guid } from '../utils'
import * as currentModel from './currentModel'

/* ----------  INITIAL STATE  ---------- */
const initialState = { isOpen: false, newModel: null }

/* ----------  ACTION TYPES  ---------- */
export const OPEN_MENU = 'OPEN_MENU'
export const CLOSE_MENU = 'CLOSE_MENU'
export const TOGGLE_MENU = 'TOGGLE_MENU'
export const ADD_MENU_MODEL = 'ADD_MENU_MODEL'
export const UPDATE_MENU_MODEL_NAME = 'UPDATE_MENU_MODEL_NAME'
export const CANCEL_MENU_MODEL = 'CANCEL_MENU_MODEL'

/* ----------  ACTION CREATORS  ---------- */
export const openMenu = () => ({
  type: OPEN_MENU
})

export const closeMenu = () => ({
  type: CLOSE_MENU
})

export const toggleMenu = () => ({
  type: TOGGLE_MENU
})

export const addMenuModel = () => ({
  type: ADD_MENU_MODEL
})

export const updateMenuModelName = name => ({
  type: UPDATE_MENU_MODEL_NAME,
  name
})

export const cancelMenuModel = () => ({
  type: CANCEL_MENU_MODEL
})

/* ----------  THUNKS  ---------- */

/* ----------  REDUCER  ---------- */
export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MENU:
      return { ...state, isOpen: true }
    case CLOSE_MENU:
      return { ...state, isOpen: false }
    case TOGGLE_MENU:
      return { ...state, isOpen: !state.isOpen }
    case ADD_MENU_MODEL:
      return {
        ...state,
        newModel: { ...currentModel.initialState, id: guid() }
      }
    case UPDATE_MENU_MODEL_NAME:
      return { ...state, newModel: { ...state.newModel, name: action.name } }
    case CANCEL_MENU_MODEL:
      return { ...state, newModel: null }
    case Models.ADD:
      return { ...state, newModel: null }
    default:
      return state
  }
}
