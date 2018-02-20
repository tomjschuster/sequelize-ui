import React from 'react'

/* ----------  APP COMPONENTS  ---------- */
import DataTypeSelect from './DataTypeSelect'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button } from 'react-toolbox/lib/button'
import Checkbox from 'react-toolbox/lib/checkbox'
import Switch from 'react-toolbox/lib/switch'
import { Card } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'

/* ----------  HELPERS  ---------- */
const isNumber = type => {
  switch (type) {
    case 'INTEGER':
    case 'FLOAT':
    case 'REAL':
    case 'DOUBLE':
    case 'DECIMAL':
      return true
    default:
      return false
  }
}

/* ----------  COMPONENT  ---------- */
const Field = ({
  field,
  updateField,
  deleteField,
  updateValidation,
  toggleField,
  isOpen
}) => (
  <Card>
    <div>
      <Input
        value={field.name}
        onChange={updateField.bind(null, 'name')}
        type='text'
        label='Field Name'
      />
      <DataTypeSelect
        currType={field.type}
        updateDataType={updateField.bind(null, 'type')}
      />
      <Button label='DELETE FIELD' onClick={deleteField} />
      <Switch onChange={toggleField} checked={isOpen} label='More Options' />
    </div>
    {isOpen && (
      <div>
        <Checkbox
          label='UNIQUE'
          checked={Boolean(field.unique)}
          onChange={updateField.bind(null, 'unique')}
        />
        {field.unique && (
          <Input
            value={field.uniqueKey || ''}
            onChange={updateField.bind(null, 'uniqueKey')}
            type='text'
            label='Unique Key'
          />
        )}
        <Checkbox
          label='NOT NULL'
          checked={field.allowNull === false}
          onChange={value => updateField('allowNull', !value)}
        />
        <Checkbox
          label='PRIMARY KEY'
          checked={field.primaryKey}
          onChange={updateField.bind(null, 'primaryKey')}
        />
        <Checkbox
          label='AUTOINCREMENT'
          checked={field.autoIncrement}
          onChange={updateField.bind(null, 'autoIncrement')}
        />
        <Input
          value={field.default || ''}
          onChange={updateField.bind(null, 'default')}
          type='text'
          label='Default Value'
        />
        <Input
          value={field.comment || ''}
          onChange={updateField.bind(null, 'comment')}
          type='text'
          label='Comment'
        />
        <Input
          value={field.field || ''}
          onChange={updateField.bind(null, 'field')}
          type='text'
          label='Field Name'
        />
        <h4>Validation</h4>
        <Input
          value={field.validate.is || ''}
          onChange={updateValidation.bind(null, 'is')}
          type='text'
          label='is (/^[a-z]+$/i)'
        />
        <Input
          value={field.validate.contains || ''}
          onChange={updateValidation.bind(null, 'contains')}
          type='text'
          label='contains'
        />
        {field.type === 'STRING' && (
          <Checkbox
            label='isEmail'
            checked={field.validate.isEmail || false}
            onChange={updateValidation.bind(null, 'isEmail')}
          />
        )}
        {field.type === 'STRING' && (
          <Checkbox
            label='isUrl'
            checked={field.validate.isUrl || false}
            onChange={updateValidation.bind(null, 'isUrl')}
          />
        )}
        {isNumber(field.type) && (
          <Input
            value={field.validate.min || ''}
            onChange={updateValidation.bind(null, 'min')}
            type='text'
            label='min'
          />
        )}
        {isNumber(field.type) && (
          <Input
            value={field.validate.max || ''}
            onChange={updateValidation.bind(null, 'max')}
            type='text'
            label='max'
          />
        )}
      </div>
    )}
  </Card>
)

export default Field
