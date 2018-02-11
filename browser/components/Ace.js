import React from 'react'
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/javascript'
import 'brace/theme/cobalt'

const Ace = () => (
  <AceEditor
    mode="javascript"
    theme="cobalt"
    name="UNIQUE_ID_OF_DIV"
    min-lines={3}
    width="100%"
  />
)

export default Ace
