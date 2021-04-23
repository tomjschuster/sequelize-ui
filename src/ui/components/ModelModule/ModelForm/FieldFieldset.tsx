import {
  dataTypeFromDataTypeType,
  DataTypeType,
  displayDataTypeType,
  Field,
  isDateTimeType,
  isIntegerType,
  isNumberType,
  isNumericType,
  isStringType,
  UuidType,
} from '@src/core/schema'
import Checkbox from '@src/ui/components/form/Checkbox'
import IntegerInput from '@src/ui/components/form/IntegerInput'
import Radio from '@src/ui/components/form/Radio'
import Select from '@src/ui/components/form/Select'
import TextInput from '@src/ui/components/form/TextInput'
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

  const handleChangeName = useCallback((name?: string) => handleChange({ name: name || '' }), [
    handleChange,
  ])

  const handleChangeDataType = useCallback(
    (type: DataTypeType) => handleChange({ type: dataTypeFromDataTypeType(type) }),
    [handleChange],
  )

  const handleChangePrimaryKey = useCallback(
    (primaryKey: boolean) => handleChange({ primaryKey }),
    [handleChange],
  )

  const handleChangeRequired = useCallback((required: boolean) => handleChange({ required }), [
    handleChange,
  ])

  const handleChangeUnique = useCallback((unique: boolean) => handleChange({ unique }), [
    handleChange,
  ])

  const handleChangeUnsigned = useCallback(
    (unsigned: boolean) =>
      isNumberType(field.type) && handleChange({ type: { ...field.type, unsigned } }),
    [field.type, handleChange],
  )

  const handleChangeAutoincrement = useCallback(
    (autoincrement: boolean) =>
      isIntegerType(field.type) && handleChange({ type: { ...field.type, autoincrement } }),
    [field.type, handleChange],
  )

  const handleChangeStringLength = useCallback(
    (length?: number) =>
      isStringType(field.type) && handleChange({ type: { ...field.type, length } }),
    [field.type, handleChange],
  )

  const handleChangePrecision = useCallback(
    (precision?: number) => {
      if (!isNumericType(field.type)) return
      if (precision === undefined) return { ...field.type, precision: undefined }
      handleChange({
        type: { ...field.type, precision: { ...field.type.precision, precision } },
      })
    },
    [field.type, handleChange],
  )

  const handleChangeScale = useCallback(
    (scale?: number) => {
      if (!isNumericType(field.type)) return
      if (field.type.precision === undefined) return
      handleChange({ type: { ...field.type, precision: { ...field.type.precision, scale } } })
    },
    [field.type, handleChange],
  )

  const handleChangeUuidDefault = useCallback(
    (defaultVersion: UuidType | undefined) =>
      field.type.type === DataTypeType.Uuid &&
      handleChange({ type: { ...field.type, defaultVersion } }),
    [field.type, handleChange],
  )

  const handleChangeDefaultNow = useCallback(
    (defaultNow: boolean) =>
      isDateTimeType(field.type) && handleChange({ type: { ...field.type, defaultNow } }),
    [field.type, handleChange],
  )

  const handleDelete = useCallback(() => onDelete(field.id), [onDelete, field.id])

  return (
    <fieldset>
      <TextInput
        id={`field-name-${field.id}`}
        label="Field name"
        value={field.name}
        error={errors?.name}
        onChange={handleChangeName}
      />
      <Select<DataTypeType>
        id={`field-type-${field.id}`}
        label="Data type"
        options={DataTypeType}
        display={displayDataTypeType}
        value={field.type.type}
        onChange={handleChangeDataType}
      />
      {isStringType(field.type) && (
        <IntegerInput
          id={`field-string-length-${field.id}`}
          label="Length"
          value={field.type.length}
          min={1}
          max={65535}
          onChange={handleChangeStringLength}
        />
      )}
      {isNumberType(field.type) && (
        <Checkbox
          id={`field-unsigned-${field.id}`}
          label="Unsigned"
          checked={!!field.type.unsigned}
          onChange={handleChangeUnsigned}
        />
      )}
      {isIntegerType(field.type) && (
        <Checkbox
          id={`field-autoincrement-${field.id}`}
          label="Autoincrement"
          checked={!!field.type.autoincrement}
          onChange={handleChangeAutoincrement}
        />
      )}
      {isNumericType(field.type) && (
        <>
          <IntegerInput
            id={`field-precision-${field.id}`}
            label="Precision"
            value={field.type.precision?.precision}
            min={1}
            max={1000}
            onChange={handleChangePrecision}
          />
          <IntegerInput
            id={`field-scale-${field.id}`}
            label="Precision"
            value={field.type.precision?.scale}
            min={0}
            max={field.type.precision?.precision || 1000}
            onChange={handleChangeScale}
          />
        </>
      )}
      {field.type.type === DataTypeType.Uuid && (
        <Radio
          options={{ ...UuidType, none: undefined }}
          value={field.type.defaultVersion}
          display={(v) => `Default: ${v || 'none'}`}
          onChange={handleChangeUuidDefault}
        />
      )}

      {isDateTimeType(field.type) && (
        <Checkbox
          id={`field-default-now-${field.id}`}
          label="Default to now"
          checked={!!field.type.defaultNow}
          onChange={handleChangeDefaultNow}
        />
      )}
      <Checkbox
        id={`field-pk-${field.id}`}
        label="Primary key"
        checked={!!field.primaryKey}
        onChange={handleChangePrimaryKey}
      />
      <Checkbox
        id={`field-required-${field.id}`}
        label="Required"
        checked={!!field.required}
        onChange={handleChangeRequired}
      />
      <Checkbox
        id={`field-unique-${field.id}`}
        label="Unique"
        checked={!!field.unique}
        onChange={handleChangeUnique}
      />
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </fieldset>
  )
}

export default React.memo(FieldFieldset)
