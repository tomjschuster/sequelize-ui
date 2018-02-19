import { Actions as CurrentModel } from './currentModel'
import { Actions as Models } from './models'

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

/* ----------  INITIAL STATE  ---------- */
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

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  RESET_UI: 'UI__RESET_UI',
  OPEN_DIALOG: 'UI__OPEN_DIALOG',
  CLOSE_DIALOG: 'UI__CLOSE_DIALOG',
  TOGGLE_FIELD: 'UI__TOGGLE_FIELD',
  CLOSE_ALL_FIELDS: 'UI__CLOSE_ALL_FIELDS',
  SET_CURRENT_MODEL_TAB_IDX: 'UI__SET_CURRENT_MODEL_TAB_IDX'
}

/* ----------  ACTION CREATORS  ---------- */
export const actionCreators = {
  resetUi: () => ({
    type: Actions.RESET_UI
  }),

  openDialog: (title, message) => ({
    type: Actions.OPEN_DIALOG,
    title,
    message
  }),

  closeDialog: () => ({
    type: Actions.CLOSE_DIALOG
  }),

  toggleField: id => ({
    type: Actions.TOGGLE_FIELD,
    id
  }),

  closeAllFields: () => ({
    type: Actions.CLOSE_ALL_FIELDS
  }),

  setCurrentModelTabIdx: idx => ({
    type: Actions.SET_CURRENT_MODEL_TAB_IDX,
    idx
  })
}

/* ----------  THUNKS  ---------- */

/* ----------  REDUCER  ---------- */
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.RESET_UI:
      return initialState
    case Actions.OPEN_DIALOG:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          open: true,
          title: action.title,
          message: action.message
        }
      }
    case Actions.CLOSE_DIALOG:
      return { ...state, dialog: initialDialog }
    case Actions.TOGGLE_FIELD:
      return {
        ...state,
        fieldsToggle: {
          ...state.fieldsToggle,
          [action.id]: !state.fieldsToggle[action.id]
        }
      }
    case Actions.CLOSE_ALL_FIELDS:
    case Models.RECEIVE:
    case Models.ADD:
    case Models.REMOVE:
    case Models.RESET:
    case Models.UPDATE:
    case CurrentModel.RESET:
      return {
        ...state,
        fieldsToggle: initialFieldsToggle
      }
    case CurrentModel.RECEIVE:
      return {
        ...state,
        fieldsToggle: initialFieldsToggle,
        modelsListIsOpen: initialModelsListIsOpen
      }
    case Actions.SET_CURRENT_MODEL_TAB_IDX:
      return { ...state, currentModelTabIdx: action.idx }
    default:
      return state
  }
}
