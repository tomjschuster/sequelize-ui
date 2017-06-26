import React from 'react'

import MainLayout from 'ui-library/MainLayout'

const messages = {
  default: 'Something went wrong...',
  404: 'Sorry, we couldn\'t find that page'
}

const ErrorMessage = ({ error: { status } }) => (
  <MainLayout>
    { messages[status] || messages.default }
  </MainLayout>
)

export default ErrorMessage

