import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { connect } from 'react-redux'

import counter, { actions as counterActions } from './counter'

const branches = {
  counter
}

const actions = {
  ...counterActions
}

export const connectAll = connect(state => state, actions)

const createReducer = ({ initialState, handler }) =>
 (state = initialState, action) => (
   handler[action.type] ? handler[action.type](state, action) : state
 )

const rootReducer = Object.keys(branches).reduce((acc, branch) => ({
  ...acc, [branch]: createReducer(branches[branch])
}), {})

export default createStore(combineReducers(rootReducer), applyMiddleware(thunk))

