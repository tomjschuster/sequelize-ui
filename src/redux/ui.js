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

const initialAddModelState = {
  creatingModel: false
}

const initialState = {
  dialog: initialDialog,
  addModelState: initialAddModelState
}

/* ----------  ACTION TYPES  ---------- */
export const Actions = {
  RESET_UI: 'UI__RESET_UI',
  OPEN_DIALOG: 'UI__OPEN_DIALOG',
  CLOSE_DIALOG: 'UI__CLOSE_DIALOG',
  START_CREATING_MODEL: 'START_CREATING_MODEL',
  STOP_CREATING_MODEL: 'STOP_CREATING_MODEL'
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

  startCreatingModel: () => ({
    type: Actions.START_CREATING_MODEL
  }),

  stopCreatingModel: () => ({
    type: Actions.STOP_CREATING_MODEL
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
      return { ...state, addModelState: initialAddModelState }
    case Actions.START_CREATING_MODEL:
      return { ...state, addModelState: { creatingModel: true } }
    case Actions.STOP_CREATING_MODEL:
      return { ...state, addModelState: { creatingModel: false } }
    default:
      return state
  }
}
