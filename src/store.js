import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from './redux'

const createStorage = keys => store => next => action => {
  const result = next(action)
  const state = store.getState()
  const persistedState = Object.keys(state).reduce(
    (acc, key) => (keys.includes(key) ? { ...acc, [key]: state[key] } : acc),
    {}
  )
  window.localStorage.setItem('sequelize-ui', JSON.stringify(persistedState))
  return result
}

const middleware =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(createStorage(['models']), thunk)
    : applyMiddleware(createStorage(['models']), logger, thunk)

let persistedState
try {
  persistedState = JSON.parse(window.localStorage.getItem('sequelize-ui'))
} catch (e) {
  persistedState = {}
}

const store = createStore(rootReducer, persistedState, middleware)

export default store
