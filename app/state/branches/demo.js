const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
const DECREMENT_COUNTER = 'DECREMENT_COUNTER'
const RESET_COUNTER = 'RESET_COUNTER'

const initialState = { counterValue: 0 }

export const actions = {
  incrementCounter: () => ({
    type: INCREMENT_COUNTER
  }),
  decrementCounter: () => ({
    type: DECREMENT_COUNTER
  }),
  resetCounter: () => ({
    type: RESET_COUNTER
  })
}

const handler = {
  [INCREMENT_COUNTER]: (state) => ({ ...state,
    counterValue: state.counterValue + 1
  }),
  [DECREMENT_COUNTER]: (state) => ({ ...state,
    counterValue: state.counterValue - 1
  }),
  [RESET_COUNTER]: (state) => ({ ...state,
    counterValue: 0
  })
}

export default { initialState, handler }
