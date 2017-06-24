import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const RESET = 'RESET'

const initialState = { counter: 0 }

const handler = {
  [INCREMENT]: (state) => ({ ...state,
    counter: state.counter + 1
  }),
  [DECREMENT]: (state) => ({ ...state,
    counter: state.counter - 1
  }),
  [RESET]: (state) => ({ ...state,
    counter: 0
  })
}

const branches = { test: { initialState, handler } }

const createReducer = ({ initialState, handler }) =>
  (state = initialState, action) => (
    handler[action.type] ? handler[action.type](state, action) : state
  )

const rootReducer = Object.keys(branches).reduce((acc, branch) => ({
  ...acc, [branch]: createReducer(branches[branch])
}), {})
console.log(rootReducer)
const store =  createStore(combineReducers(rootReducer), applyMiddleware(thunk))
export default store

