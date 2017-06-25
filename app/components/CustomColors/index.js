import React from 'react'
import { Button } from 'react-toolbox/lib/button'

import successButtonStyle from './SuccessButton.css'

const CustomColors = () => (
  <ul>
    <li>
      <Button label='Primary' primary raised />
    </li>
    <li>
      <Button
        label='Success'
        primary
        raised
        theme={successButtonStyle}
      />
    </li>
    <li>
      <Button
        label='Accent'
        accent
        raised
        theme={successButtonStyle}
      />
    </li>
  </ul>
)

export default CustomColors
