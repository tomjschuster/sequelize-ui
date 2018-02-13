import { compose, createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import adapter from 'redux-localstorage/lib/adapters/localStorage'
import persistState, { mergePersistedState } from 'redux-localstorage'
import thunk from 'redux-thunk'

import rootReducer from './redux'

const reducer = compose(mergePersistedState())(rootReducer)

const enhancer = compose(
  applyMiddleware(logger, thunk),
  persistState(adapter(window.localStorage), 'models')
)

export default createStore(reducer, enhancer)
