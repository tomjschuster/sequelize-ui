import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import * as branches from './branches'

const createReducer = ({ initialState, handler }) =>
 (state = initialState, action) => (
   handler[action.type] ? handler[action.type](state, action) : state
 )

const reducers = Object.keys(branches).reduce((acc, branch) => ({
  ...acc, [branch]: createReducer(branches[branch])
}), {})

const middlewares = applyMiddleware(thunk)

export default createStore(combineReducers(reducers), middlewares)

