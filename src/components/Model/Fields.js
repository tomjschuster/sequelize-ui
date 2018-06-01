import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button, Input, Dropdown, Checkbox, Card, Form, Segment } from 'semantic-ui-react'

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
  isOpen
}) => (
  <Segment>
    <Form>
      <Form.Group widths='equal'>
        <Form.Input
          fluid
          label='Field Name'
          value={field.name}
          onChange={(_, data) => updateField('name', data.value)}
          type='text'
        />
        <Form.Select
          fluid
          label='Data Type'
          search
          onChange={(_, data) => updateField('type', data.value)}
          options={dataTypeOptions}
          value={field.type}
        />

        <Form.Button
          icon='trash'
          size='tiny'
          circular
        />
      </Form.Group>
      <Form.Group>
        <Form.Checkbox
          label='NOT NULL'
          checked={field.allowNull === false}
          onClick={(_, data) => updateField('allowNull', !data.checked)}
        />
        <Form.Checkbox
          label='PRIMARY KEY'
          checked={field.primaryKey}
          onClick={(_, data) => updateField('primaryKey', data.checked)}
        />
        <Form.Checkbox
          label='AUTOINCREMENT'
          checked={field.autoIncrement}
          onClick={(_, data) => updateField('autoIncrement', data.checked)}
        />
      </Form.Group>
      <Form.Group>
        <Input
          value={field.default || ''}
          onChange={(_, data) => updateField('default', data.value)}
          type='text'
          label='Default Value'
        />
      </Form.Group>
      <Form.Group>
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
      </Form.Group>
    </Form>
  </Segment>
)

const Fields = ({
  // State
  fields,
  fieldsToggle,
  // Actions
  currentModelActions: { addField, updateField, removeField }
}) => (
  <React.Fragment>
    <h3>Fields</h3>
    <Button icon='add' circular onClick={addField} />
    <Segment.Group compact>
      {fields.map(field => (
        <Field
          key={field.id}
          field={field}
          updateField={updateField.bind(null, field.id)}
          removeField={removeField.bind(null, field.id)}
        />
      ))}
    </Segment.Group>
  </React.Fragment>
)

export default Fields
