import React from 'react'
import { Demo, ErrorMessage } from 'views'

export default [
  {
    path: '/demo',
    action: () => <Demo />
  },
  {
    path: '/error',
    action: ({ error }) => <ErrorMessage error={error} />
  }
]
