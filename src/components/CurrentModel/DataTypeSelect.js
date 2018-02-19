import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Autocomplete from 'react-toolbox/lib/autocomplete'

/* ----------  CONSTANTS  ---------- */
const source = {
  STRING: 'String',
  TEXT: 'Text',
  INTEGER: 'Integer',
  FLOAT: 'Float',
  REAL: 'Real',
  DOUBLE: 'Double',
  DECIMAL: 'Decimal',
  DATE: 'Date',
  DATEONLY: 'Date (without time)',
  BOOLEAN: 'Boolean',
  ARRAY: 'Array',
  JSON: 'JSON',
  BLOB: 'BLOB',
  UUID: 'UUID'
}

/* ----------  COMPONENT  ---------- */
const DataTypeSelect = ({ currType, updateDataType }) => (
  <Autocomplete
    direction='down'
    multiple={false}
    onChange={updateDataType}
    source={source}
    value={currType}
    label='Data Type'
  />
)

export default DataTypeSelect
