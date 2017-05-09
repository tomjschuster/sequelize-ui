'use strict'

import React, { Component } from 'react'
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/javascript'
import 'brace/theme/cobalt'


const onChange = evt => {
  console.log('change', evt)
}

export default class Ace extends Component {
  render() {
      return (
        <AceEditor
          mode='javascript'
          theme='cobalt'
          onChange={onChange}
          name='UNIQUE_ID_OF_DIV'
          min-lines={3}
          width='100%'
        />
      )
  }
}
