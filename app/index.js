import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { store } from 'state'
import router, { history, routes } from 'router'
import 'theme/global.css'

const appDiv = document.getElementById('app')

const renderView = view => {
  ReactDOM.render(
    <Provider store={store}>
      { view }
    </Provider>,
    appDiv
  )
}

const render = location => {
  router.resolve(routes, location)
    .then(renderView)
    .catch(error => {
      if (process.env.NODE_ENV === 'development') { console.error(error) }
      router.resolve(routes, { ...location, error }).then(renderView)
    })
}

history.listen(render)
render(history.location)
