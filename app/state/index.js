import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { connect } from 'react-redux'

import demo, { actions as counterActions } from './demo'

const branches = {
  demo
}

const actions = {
  ...counterActions
}

export const connectAll = connect(state => state, actions)

const createReducer = ({ initialState, handler }) =>
 (state = initialState, action) => (
   handler[action.type] ? handler[action.type](state, action) : state
 )

const reducers = Object.keys(branches).reduce((acc, branch) => ({
  ...acc, [branch]: createReducer(branches[branch])
}), {})

const middlewares = applyMiddleware(thunk)
export const store = createStore(combineReducers(reducers), middlewares)

