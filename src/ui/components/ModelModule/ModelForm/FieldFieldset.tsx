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
import { FieldErrors } from '@src/core/validation/schema'
import Checkbox from '@src/ui/components/form/Checkbox'
import IntegerInput from '@src/ui/components/form/IntegerInput'
import Select from '@src/ui/components/form/Select'
import TextInput from '@src/ui/components/form/TextInput'
import { classnames } from '@src/ui/styles/classnames'
import React, { useCallback } from 'react'
import CloseIcon from '@src/ui/components/icons/Close'

type FieldFieldsetProps = {
  field: Field
  errors?: FieldErrors
  onChange: (id: Field['id'], changes: Partial<Field>) => void
  onDelete: (id: Field['id']) => void
}
function FieldFieldset({ field, errors, onChange, onDelete }: FieldFieldsetProps) {
  const handleChange = useCallback(
    (change: Partial<Field>): void => onChange(field.id, change),
    [field.id, onChange],
  )

  const handleChangeName = useCallback(
    (name?: string) => handleChange({ name: name || '' }),
    [handleChange],
  )

  const handleChangeDataType = useCallback(
    (type: DataTypeType) => handleChange({ type: dataTypeFromDataTypeType(type) }),
    [handleChange],
  )

  const handleChangePrimaryKey = useCallback(
    (primaryKey: boolean) => handleChange({ primaryKey }),
    [handleChange],
  )

  const handleChangeRequired = useCallback(
    (required: boolean) => handleChange({ required }),
    [handleChange],
  )

  const handleChangeUnique = useCallback(
    (unique: boolean) => handleChange({ unique }),
    [handleChange],
  )

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
    <fieldset
      className={classnames(
        'p-4',
        'pt-5',
        'grid',
        'grid-cols-12',
        'gap-y-2',
        'gap-x-4',
        'relative',
      )}
    >
      <div className={classnames('col-span-12')}>
        <TextInput
          id={`field-name-${field.id}`}
          label="Field name"
          value={field.name}
          error={errors?.name}
          onChange={handleChangeName}
        />
      </div>
      <div className={classnames('col-span-6')}>
        <Select<DataTypeType>
          id={`field-type-${field.id}`}
          label="Data type"
          options={DataTypeType}
          display={displayDataTypeType}
          value={field.type.type}
          onChange={handleChangeDataType}
        />
      </div>
      <div className={classnames('col-span-6', 'flex')}>
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
          <div className={classnames('flex', 'flex-col', 'justify-center', 'self-center', 'pt-2')}>
            <Checkbox
              id={`field-unsigned-${field.id}`}
              label="Unsigned"
              checked={!!field.type.unsigned}
              onChange={handleChangeUnsigned}
            />
            {isIntegerType(field.type) && (
              <Checkbox
                id={`field-autoincrement-${field.id}`}
                label="Autoincrement"
                checked={!!field.type.autoincrement}
                onChange={handleChangeAutoincrement}
              />
            )}
          </div>
        )}

        {isDateTimeType(field.type) && (
          <div className={classnames('flex', 'flex-col', 'justify-center', 'self-center', 'pt-4')}>
            <Checkbox
              id={`field-default-now-${field.id}`}
              label="Default to now"
              checked={!!field.type.defaultNow}
              onChange={handleChangeDefaultNow}
            />
          </div>
        )}

        {field.type.type === DataTypeType.Uuid && (
          <Select<UuidType | undefined>
            id={`uuid-type-${field.id}`}
            label="Default"
            options={{ ...UuidType, none: undefined }}
            value={field.type.defaultVersion}
            display={(v) => `${v ? `UUID ${v}` : 'none'}`}
            onChange={handleChangeUuidDefault}
          />
        )}
      </div>
      {isNumericType(field.type) && (
        <>
          <div className={classnames('col-span-6')}>
            <IntegerInput
              id={`field-precision-${field.id}`}
              label="Precision"
              value={field.type.precision?.precision}
              min={1}
              max={1000}
              onChange={handleChangePrecision}
            />
          </div>
          <div className={classnames('col-span-6')}>
            <IntegerInput
              id={`field-scale-${field.id}`}
              label="Precision"
              value={field.type.precision?.scale}
              min={0}
              max={field.type.precision?.precision || 1000}
              onChange={handleChangeScale}
            />
          </div>
        </>
      )}
      <div className={classnames('col-span-12', 'flex', 'flex-col')}>
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
      </div>
      <div className="absolute top-0 right-0 p-1">
        <button type="button" onClick={handleDelete}>
          <CloseIcon title="delete" />
        </button>
      </div>
    </fieldset>
  )
}

export default React.memo(FieldFieldset)
