import React from 'react'
import { Demo, ErrorMessage } from 'views'
import { actions } from 'state'

export default [
  {
    path: '/demo',
    action: () => {
      actions.demo.incrementCounter()
      return  <Demo />
    }
  },
  {
    path: '/error',
    action: ({ error }) => <ErrorMessage error={error} />
  }
]
