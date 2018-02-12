import React from 'react'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import Dropdown from 'react-toolbox/lib/dropdown'

/*----------  CONSTANTS  ----------*/
const sequelizeDataTypes = [
  { label: 'String', value: 'STRING' },
  { label: 'Text', value: 'TEXT' },
  { label: 'Integer', value: 'INTEGER' },
  { label: 'Float', value: 'FLOAT' },
  { label: 'Real', value: 'REAL' },
  { label: 'Double', value: 'DOUBLE' },
  { label: 'Decimal', value: 'DECIMAL' },
  { label: 'Date', value: 'DATE' },
  { label: 'Date (without time)', value: 'DATEONLY' },
  { label: 'Boolean', value: 'BOOLEAN' },
  { label: 'Array', value: 'ARRAY' },
  { label: 'JSON', value: 'JSON' },
  { label: 'BLOB', value: 'BLOB' },
  { label: 'UUID', value: 'UUID' }
]

/*----------  COMPONENT  ----------*/
const DataTypeDropdown = ({ currType, id, onClick }) => (
  <Dropdown
    auto
    onChange={value => onClick('type', value, id)}
    source={sequelizeDataTypes}
    value={currType}
    label="Data Type"
  />
)

export default DataTypeDropdown
