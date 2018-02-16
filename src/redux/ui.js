export const messages = {
  reqModelName: 'Please give your model a name.',
  reqFieldName: 'Every field must have a name.',
  reqFieldType: 'Every field must have a data type.',
  reqAssociationRelationship: 'Every association must have a relationship.',
  reqAssociationTarget: 'Every association must have a target model.',
  reqAssociationThrough:
    "'belongsToMany' associations must have a 'through' table.",
  dupFieldName: 'Table name already exists. Please select another name.'
}

import { RECEIVE_MODEL, RESET_MODEL } from './currentModel'
import {
  RECEIVE_MODELS,
  ADD_MODEL,
  REMOVE_MODEL,
  RESET_MODELS,
  UPDATE_MODEL
} from './models'

/*----------  INITIAL STATE  ----------*/
const initialDialog = {
  open: false,
  title: '',
  message: ''
}

const initialFieldsToggle = {}

const initialCurrentModelTabIdx = 0

const initialModelsListIsOpen = false

const initialState = {
  dialog: initialDialog,
  fieldsToggle: initialFieldsToggle,
  currentModelTabIdx: initialCurrentModelTabIdx,
  modelsListIsOpen: initialModelsListIsOpen
}

/*----------  ACTION TYPES  ----------*/
const RESET_UI = 'RESET_UI'
const OPEN_DIALOG = 'OPEN_DIALOG'
const CLOSE_DIALOG = 'CLOSE_DIALOG'
const TOGGLE_FIELD = 'TOGGLE_FIELD'
const CLOSE_ALL_FIELDS = 'CLOSE_ALL_FIELDS'
const SET_CURRENT_MODEL_TAB_IDX = 'SET_CURRENT_MODEL_TAB_IDX'
const OPEN_MODELS_LIST = 'OPEN_MODELS_LIST'
const CLOSE_MODELS_LIST = 'CLOSE_MODELS_LIST'
const TOGGLE_MENUS_LIST = 'TOGGLE_MENUS_LIST'

/*----------  ACTION CREATORS  ----------*/
export const resetUi = () => ({
  type: RESET_UI
})
export const openDialog = (title, message) => ({
  type: OPEN_DIALOG,
  title,
  message
})

export const closeDialog = () => ({
  type: CLOSE_DIALOG
})

export const toggleField = id => ({
  type: TOGGLE_FIELD,
  id
})

export const closeAllFields = () => ({
  type: CLOSE_ALL_FIELDS
})

export const setCurrentModelTabIdx = idx => ({
  type: SET_CURRENT_MODEL_TAB_IDX,
  idx
})

export const openModelsList = () => ({
  type: OPEN_MODELS_LIST
})

export const closeModelsList = () => ({
  type: CLOSE_MODELS_LIST
})

export const toggleMenusList = () => ({
  type: TOGGLE_MENUS_LIST
})
/*----------  THUNKS  ----------*/

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_UI:
      return initialState
    case OPEN_DIALOG:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          open: true,
          title: action.title,
          message: action.message
        }
      }
    case CLOSE_DIALOG:
      return { ...state, dialog: initialDialog }
    case TOGGLE_FIELD:
      return {
        ...state,
        fieldsToggle: {
          ...state.fieldsToggle,
          [action.id]: !state.fieldsToggle[action.id]
        }
      }
    case OPEN_MODELS_LIST:
      return { ...state, modelsListIsOpen: true }
    case CLOSE_MODELS_LIST:
      return { ...state, modelsListIsOpen: false }
    case TOGGLE_MENUS_LIST:
      return { ...state, modelsListIsOpen: !state.modelsListIsOpen }
    case CLOSE_ALL_FIELDS:
    case RECEIVE_MODELS:
    case ADD_MODEL:
    case REMOVE_MODEL:
    case RESET_MODELS:
    case UPDATE_MODEL:
    case RESET_MODEL:
      return {
        ...state,
        fieldsToggle: initialFieldsToggle
      }
    case RECEIVE_MODEL:
      return {
        ...state,
        fieldsToggle: initialFieldsToggle,
        modelsListIsOpen: initialModelsListIsOpen
      }
    case SET_CURRENT_MODEL_TAB_IDX:
      return { ...state, currentModelTabIdx: action.idx }
    default:
      return state
  }
}
