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

/*----------  INITIAL STATE  ----------*/
const initialState = {
  open: false,
  title: '',
  message: ''
}

/*----------  ACTION TYPES  ----------*/
const OPEN_DIALOG = 'OPEN_DIALOG'

const CLOSE_DIALOG = 'CLOSE_DIALOG'

/*----------  ACTION CREATORS  ----------*/
export const openDialog = (title, message) => ({
  type: OPEN_DIALOG,
  title,
  message
})

export const closeDialog = () => ({
  type: CLOSE_DIALOG
})

/*----------  THUNKS  ----------*/

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_DIALOG:
      return {
        ...state,
        open: true,
        title: action.title,
        message: action.message
      }
    case CLOSE_DIALOG:
      return initialState
    default:
      return state
  }
}
