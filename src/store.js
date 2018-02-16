import { compose, createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import persistState, { mergePersistedState } from 'redux-localstorage'
import adapter from 'redux-localstorage/lib/adapters/localStorage'
import filter from 'redux-localstorage-filter'

import rootReducer from './redux'

const storage = compose(filter('models'))(adapter(window.localStorage))

const enhancer = compose(
  applyMiddleware(logger, thunk),
  persistState(storage, 'sequelize-ui')
)

const reducer = compose(mergePersistedState())(rootReducer)

const store = createStore(reducer, enhancer)

export default store
