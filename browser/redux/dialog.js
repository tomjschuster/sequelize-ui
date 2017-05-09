'use strict'

export const messages = {
  reqModelName: 'Please give your model a name.',
  reqFieldName: 'Every field must have a name.',
  reqFieldType: 'Every field must have a data type.',
  reqAssociationRelationship: 'Every association must have a relationship.',
  reqAssociationTarget: 'Every association must have a target model.',
  reqAssociationThrough: '\'belongsToMany\' associations must have a \'through\' table.',
  dupFieldName: 'Table name already exists. Please select another name.',
}

/*----------  INITIAL STATE  ----------*/
const initialState = {
  open: false,
  title: '',
  message: ''
}

/*----------  ACTION TYPES  ----------*/
const OPEN_WINDOW = 'OPEN_WINDOW'

const CLOSE_WINDOW = 'CLOSE_WINDOW'

/*----------  ACTION CREATORS  ----------*/
export const openWindow = (title, message)  => ({
  type: OPEN_WINDOW,
  title,
  message
})

export const closeWindow = () => ({
  type: CLOSE_WINDOW,
})

/*----------  THUNKS  ----------*/

/*----------  REDUCER  ----------*/
export default (state = initialState, action) => {
  let dialog = Object.assign({}, state)
  switch (action.type) {
    case OPEN_WINDOW:
      dialog.open = true
      dialog.title = action.title
      dialog.message = action.message
      return dialog
    case CLOSE_WINDOW:
      return initialState
    default:
      return state
  }
}
