import React from 'react'
import { IconButton } from 'react-toolbox/lib/button'

const Counter = ({ increment, decrement, reset, value }) => (
  <div>
    <h2>Counter</h2>
    <p>Value: {value}</p>
    <IconButton icon='remove_circle_outline' onClick={decrement} />
    <IconButton icon='clear' onClick={reset} />
    <IconButton icon='add_circle_outline' onClick={increment} />
  </div>
)

export default Counter

