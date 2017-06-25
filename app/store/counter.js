const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const RESET = 'RESET'

const initialState = { value: 0 }

export const actions = {
  increment: () => ({
    type: INCREMENT
  }),
  decrement: () => ({
    type: DECREMENT
  }),
  reset: () => ({
    type: RESET
  })
}

const handler = {
  [INCREMENT]: (state) => ({ ...state,
    value: state.value + 1
  }),
  [DECREMENT]: (state) => ({ ...state,
    value: state.value - 1
  }),
  [RESET]: (state) => ({ ...state,
    value: 0
  })
}

export default { initialState, handler }
