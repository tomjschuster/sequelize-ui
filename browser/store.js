import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducer from './redux'


const middleware = applyMiddleware(thunkMiddleware, createLogger())


export default createStore(reducer, middleware)
