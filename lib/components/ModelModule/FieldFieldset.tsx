import {
  dataTypeFromDataTypeType,
  DataTypeType,
  displayDataTypeType,
  Field,
  isDateTimeType,
} from '@lib/core'
import React from 'react'
import Checkbox from '../form/Checkbox'
import Select from '../form/Select'

type FieldFieldsetProps = {
  field: Field
  onChange: (field: Field, changes: Partial<Field>) => void
}
function FieldFieldset({ field, onChange }: FieldFieldsetProps) {
  const handleChange = React.useCallback(
    (change: Partial<Field>): void => onChange(field, change),
    [field, onChange],
  )

  const handleChangeFieldName = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => handleChange({ name: evt.target.value }),
    [handleChange],
  )

  const handleChangeFieldDataType = React.useCallback(
    (type: DataTypeType) => handleChange({ type: dataTypeFromDataTypeType(type) }),
    [handleChange],
  )

  const handleChangeFieldPrimaryKey = React.useCallback(
    (primaryKey: boolean) => handleChange({ primaryKey }),
    [handleChange],
  )

  const handleChangeFieldRequired = React.useCallback(
    (required: boolean) => handleChange({ required }),
    [handleChange],
  )

  const handleChangeFieldUnique = React.useCallback(
    (unique: boolean) => handleChange({ unique }),
    [],
  )

  const handleChangeFieldAutoincrement = React.useCallback(
    (autoincrement: boolean) =>
      handleChange({
        type:
          field.type.type === DataTypeType.Integer ? { ...field.type, autoincrement } : field.type,
      }),
    [handleChange, field],
  )

  const handleChangeFieldDefaultNow = React.useCallback(
    (defaultNow: boolean) =>
      handleChange({
        type: isDateTimeType(field.type) ? { ...field.type, defaultNow } : field.type,
      }),
    [handleChange, field],
  )

  return (
    <fieldset>
      <label htmlFor={`field-name-${field.id}`}>
        Field name
        <input
          id={`field-name-${field.id}`}
          type="text"
          value={field.name}
          onChange={handleChangeFieldName}
        />
      </label>

      <Select<DataTypeType>
        id={`field-type-${field.id}`}
        label="Data type"
        options={DataTypeType}
        display={displayDataTypeType}
        value={field.type.type}
        onChange={handleChangeFieldDataType}
      />
      {field.type.type === DataTypeType.Integer && (
        <Checkbox
          id={`field-autoincrement-${field.id}`}
          label="Autoincrement"
          checked={!!field.type.autoincrement}
          onChange={handleChangeFieldAutoincrement}
        />
      )}

      {isDateTimeType(field.type) && (
        <Checkbox
          id={`field-default-now-${field.id}`}
          label="Default to now"
          checked={!!field.type.defaultNow}
          onChange={handleChangeFieldDefaultNow}
        />
      )}
      <Checkbox
        id={`field-pk-${field.id}`}
        label="Primary key"
        checked={!!field.primaryKey}
        onChange={handleChangeFieldPrimaryKey}
      />
      <Checkbox
        id={`field-required-${field.id}`}
        label="Required"
        checked={!!field.required}
        onChange={handleChangeFieldRequired}
      />
      <Checkbox
        id={`field-unique-${field.id}`}
        label="Unique"
        checked={!!field.unique}
        onChange={handleChangeFieldUnique}
      />
    </fieldset>
  )
}

export default React.memo(FieldFieldset)
