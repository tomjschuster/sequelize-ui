import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './state'
import Demo from './views/demo'
// eslint-disable-next-line no-unused-vars
import { globalStyle } from 'theme'

render(
  <Provider store={store}>
    <Demo />
  </Provider>,
  document.getElementById('app')
)

