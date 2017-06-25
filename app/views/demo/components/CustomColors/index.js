import React from 'react'
import { Button } from 'react-toolbox/lib/button'
import SuccessButton from 'ui-library/SuccessButton'
import { buttonList } from './style.css'

const CustomColors = () => (
  <ul className={buttonList}>
    <li>Imported Class</li>
    <li><h3>Nested CSS</h3></li>
    <li>
      <div>
        Theme Colors:
      </div>
      <Button
        label='Primary'
        primary
        raised
      />
      <Button
        label='Accent'
        accent
        raised
      />
    </li>
    <li>
      <div>
        Themed Component:
      </div>
      <SuccessButton
        label='Success Button'
      />
    </li>
  </ul>
)

export default CustomColors
