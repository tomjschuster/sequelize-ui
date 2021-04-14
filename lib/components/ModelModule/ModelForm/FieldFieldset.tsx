import Checkbox from '@lib/components/form/Checkbox'
import Select from '@lib/components/form/Select'
import TextInput from '@lib/components/form/TextInput'
import {
  dataTypeFromDataTypeType,
  DataTypeType,
  displayDataTypeType,
  Field,
  isDateTimeType,
} from '@lib/core'
import React, { useCallback } from 'react'
import { FieldFormErrors } from './validation'

type FieldFieldsetProps = {
  field: Field
  errors?: FieldFormErrors
  onChange: (id: Field['id'], changes: Partial<Field>) => void
  onDelete: (id: Field['id']) => void
}
function FieldFieldset({ field, errors, onChange, onDelete }: FieldFieldsetProps) {
  const handleChange = useCallback((change: Partial<Field>): void => onChange(field.id, change), [
    field.id,
    onChange,
  ])

  const handleChangeFieldName = useCallback((name: string) => handleChange({ name }), [
    handleChange,
  ])

  const handleChangeFieldDataType = useCallback(
    (type: DataTypeType) => handleChange({ type: dataTypeFromDataTypeType(type) }),
    [handleChange],
  )

  const handleChangeFieldPrimaryKey = useCallback(
    (primaryKey: boolean) => handleChange({ primaryKey }),
    [handleChange],
  )

  const handleChangeFieldRequired = useCallback((required: boolean) => handleChange({ required }), [
    handleChange,
  ])

  const handleChangeFieldUnique = useCallback((unique: boolean) => handleChange({ unique }), [
    handleChange,
  ])

  const handleChangeFieldAutoincrement = useCallback(
    (autoincrement: boolean) =>
      handleChange({
        type:
          field.type.type === DataTypeType.Integer ? { ...field.type, autoincrement } : field.type,
      }),
    [field.type, handleChange],
  )

  const handleChangeFieldDefaultNow = useCallback(
    (defaultNow: boolean) =>
      handleChange({
        type: isDateTimeType(field.type) ? { ...field.type, defaultNow } : field.type,
      }),
    [field.type, handleChange],
  )

  const handleDelete = useCallback(() => onDelete(field.id), [onDelete, field.id])

  return (
    <fieldset>
      <TextInput
        id={`field-name-${field.id}`}
        label="Field name"
        value={field.name}
        onChange={handleChangeFieldName}
      />
      {errors?.name && <p>{errors.name}</p>}

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
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </fieldset>
  )
}

export default React.memo(FieldFieldset)
