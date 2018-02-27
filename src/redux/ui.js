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

const initialSideBarIsOpen = false

const initialState = {
  dialog: initialDialog,
  fieldsToggle: initialFieldsToggle,
  currentModelTabIdx: initialCurrentModelTabIdx,
  modelsListIsOpen: initialModelsListIsOpen,
  sideBarIsOpen: initialSideBarIsOpen
}

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  RESET_UI: 'UI__RESET_UI',
  OPEN_DIALOG: 'UI__OPEN_DIALOG',
  CLOSE_DIALOG: 'UI__CLOSE_DIALOG',
  TOGGLE_FIELD: 'UI__TOGGLE_FIELD',
  CLOSE_ALL_FIELDS: 'UI__CLOSE_ALL_FIELDS',
  SET_CURRENT_MODEL_TAB_IDX: 'UI__SET_CURRENT_MODEL_TAB_IDX',
  TOGGLE_SIDE_BAR: 'TOGGLE_SIDE_BAR',
  CLOSE_SIDE_BAR: 'CLOSE_SIDE_BAR'
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
  }),

  toggleSideBar: () => ({
    type: Actions.TOGGLE_SIDE_BAR
  }),

  closeSideBar: () => ({
    type: Actions.CLOSE_SIDE_BAR
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
    case Models.ADD:
      return {
        ...state,
        fieldsToggle: initialFieldsToggle,
        sideBarIsOpen: initialSideBarIsOpen
      }
    case Actions.CLOSE_ALL_FIELDS:
    case Models.RECEIVE:
    case Models.REMOVE:
    case Models.RESET:
    case Models.UPDATE:
    case CurrentModel.RECEIVE:
    case CurrentModel.RESET:
    case CurrentModel.RECEIVE:
      return {
        ...state,
        fieldsToggle: initialFieldsToggle,
        sideBarIsOpen: initialSideBarIsOpen
      }
    case Actions.SET_CURRENT_MODEL_TAB_IDX:
      return { ...state, currentModelTabIdx: action.idx }
    case Actions.TOGGLE_SIDE_BAR:
      return { ...state, sideBarIsOpen: !state.sideBarIsOpen }
    case Actions.CLOSE_SIDE_BAR:
      return { ...state, sideBarIsOpen: false }
    default:
      return state
  }
}
