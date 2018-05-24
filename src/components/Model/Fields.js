import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button, Input, Dropdown, Checkbox, Card } from 'semantic-ui-react'

/* ----------  CONSTANTS  ---------- */
const dataTypeOptions = [
  {text: 'String', value: 'STRING'},
  {text: 'Text', value: 'TEXT'},
  {text: 'Integer', value: 'INTEGER'},
  {text: 'Float', value: 'FLOAT'},
  {text: 'Real', value: 'REAL'},
  {text: 'Double', value: 'DOUBLE'},
  {text: 'Decimal', value: 'DECIMAL'},
  {text: 'Date', value: 'DATE'},
  {text: 'Date (without time)', value: 'DATEONLY'},
  {text: 'Boolean', value: 'BOOLEAN'},
  {text: 'Array', value: 'ARRAY'},
  {text: 'JSON', value: 'JSON'},
  {text: 'BLOB', value: 'BLOB'},
  {text: 'UUID', value: 'UUID'}
]

/* ----------  COMPONENT  ---------- */
const Field = ({
  field,
  updateField,
  removeField,
  toggleField,
  isOpen
}) => (
  <Card>
    <Input
      value={field.name}
      onChange={(_, data) => updateField('name', data.value)}
      type='text'
      label='Field Name'
    />
    <Dropdown
      placeholder='Data Type'
      search
      selection
      onChange={(_, data) => updateField('type', data.value)}
      options={dataTypeOptions}
      value={field.type}
    />
    <Button icon='delete' onClick={removeField} primary />
    <Checkbox
      toggle
      onChange={(_, data) => toggleField(data.checked)}
      checked={isOpen}
      label='More Options'
    />
    {isOpen && (
      <React.Fragment>
        <Checkbox
          label='UNIQUE'
          checked={Boolean(field.unique)}
          onClick={(_, data) => updateField('unique', data.checked)}
        />
        {field.unique && (
          <Input
            value={field.uniqueKey || ''}
            onChange={(_, data) => updateField('uniqueKey', data.value)}
            type='text'
            label='Unique Key'
          />
        )}
        <Checkbox
          label='NOT NULL'
          checked={field.allowNull === false}
          onClick={(_, data) => updateField('allowNull', !data.checked)}
        />
        <Checkbox
          label='PRIMARY KEY'
          checked={field.primaryKey}
          onClick={(_, data) => updateField('primaryKey', data.checked)}
        />
        <Checkbox
          label='AUTOINCREMENT'
          checked={field.autoIncrement}
          onClick={(_, data) => updateField('autoIncrement', data.checked)}
        />
        <Input
          value={field.default || ''}
          onChange={(_, data) => updateField('default', data.value)}
          type='text'
          label='Default Value'
        />
        <Input
          value={field.comment || ''}
          onChange={(_, data) => updateField('comment', data.value)}
          type='text'
          label='Comment'
        />
        <Input
          value={field.field || ''}
          onChange={(_, data) => updateField('field', data.value)}
          type='text'
          label='Field Name'
        />
      </React.Fragment>
    )}
  </Card>
)

const Fields = ({
  // State
  fields,
  fieldsToggle,
  // Actions
  currentModelActions: { addField, updateField, removeField },
  uiActions: { toggleField }
}) => (
  <React.Fragment>
    <h3>Fields</h3>
    <Button icon='add' circular onClick={addField} />
    <React.Fragment>
      {fields.map(field => (
        <Field
          key={field.id}
          field={field}
          isOpen={!!fieldsToggle[field.id]}
          updateField={updateField.bind(null, field.id)}
          removeField={removeField.bind(null, field.id)}
          toggleField={toggleField.bind(null, field.id)}
        />
      ))}
    </React.Fragment>
  </React.Fragment>
)

export default Fields
