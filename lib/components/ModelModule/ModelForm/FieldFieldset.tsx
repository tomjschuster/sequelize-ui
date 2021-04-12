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
import React from 'react'

type FieldFieldsetProps = {
  field: Field
  onChange: (field: Field, changes: Partial<Field>) => void
}
function FieldFieldset({ field, onChange }: FieldFieldsetProps) {
  const handleChange = (change: Partial<Field>): void => onChange(field, change)

  const handleChangeFieldName = (name: string) => handleChange({ name })

  const handleChangeFieldDataType = (type: DataTypeType) =>
    handleChange({ type: dataTypeFromDataTypeType(type) })

  const handleChangeFieldPrimaryKey = (primaryKey: boolean) => handleChange({ primaryKey })

  const handleChangeFieldRequired = (required: boolean) => handleChange({ required })

  const handleChangeFieldUnique = (unique: boolean) => handleChange({ unique })

  const handleChangeFieldAutoincrement = (autoincrement: boolean) =>
    handleChange({
      type:
        field.type.type === DataTypeType.Integer ? { ...field.type, autoincrement } : field.type,
    })

  const handleChangeFieldDefaultNow = (defaultNow: boolean) =>
    handleChange({
      type: isDateTimeType(field.type) ? { ...field.type, defaultNow } : field.type,
    })

  return (
    <fieldset>
      <TextInput
        id={`field-name-${field.id}`}
        label="Field name"
        value={field.name}
        onChange={handleChangeFieldName}
      />

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
