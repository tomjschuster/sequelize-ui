import { compose, createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import adapter from 'redux-localstorage/lib/adapters/localStorage'
import filter from 'redux-localstorage-filter'
import persistState, { mergePersistedState } from 'redux-localstorage'
import thunk from 'redux-thunk'

import rootReducer from './redux'

const storage = compose(filter('models'))(adapter(window.localStorage))
const reducer = compose(mergePersistedState())(rootReducer)

const enhancer = compose(
  applyMiddleware(logger, thunk),
  // applyMiddleware(thunk),
  persistState(storage, 'sequelize-ui')
)

export default createStore(reducer, enhancer)
