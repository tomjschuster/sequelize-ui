import React from 'react'
import { Button } from 'react-toolbox/lib/button'
import theme from './theme.css'

const SuccessButton = props => (
  <Button
    raised
    floating
    primary
    theme={theme}
    {...props}
  />
)

export default SuccessButton
