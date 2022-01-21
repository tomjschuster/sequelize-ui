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
import TrashIcon from '@src/ui/components/icons/Trash'
import {
  alignSelf,
  classnames,
  display,
  flexDirection,
  gridColumn,
  gridRow,
  inset,
  justifyContent,
  margin,
  padding,
  position,
} from '@src/ui/styles/classnames'
import { fieldsetGrid } from '@src/ui/styles/utils'
import React from 'react'
import IconButton from '../form/IconButton'
import TextArea from '../form/TextArea'

type FieldFieldsetProps = {
  field: Field
  errors?: FieldErrors
  onChange: (id: Field['id'], changes: Partial<Field>) => void
  onDelete: (id: Field['id']) => void
}
function FieldFieldset({ field, errors, onChange, onDelete }: FieldFieldsetProps) {
  const [enumInputValue, setEnumInputValue] = React.useState<string | undefined>(() =>
    field.type.type === DataTypeType.Enum ? field.type.values.join('\n') : undefined,
  )

  const handleChange = React.useCallback(
    (change: Partial<Field>): void => onChange(field.id, change),
    [field.id, onChange],
  )

  const handleBlurEnumInput = React.useCallback(() => {
    if (field.type.type === DataTypeType.Enum) {
      const values =
        enumInputValue
          // clear leading/tracing non-word characters and any non-(word|space|-|;|,)
          ?.replaceAll(/^\W+|[^\w\n -,;]|\W+$/g, '')
          // split on , ; \n
          .split(/[ ]*,[ ]*|[ ]*;[ ]*|[ ]*\n[ ]*/) || []

      handleChange({ type: { ...field.type, values } })
      setEnumInputValue(values.join('\n'))
    }
  }, [field.type, enumInputValue, handleChange])

  const handleChangeName = React.useCallback(
    (name?: string) => handleChange({ name: name || '' }),
    [handleChange],
  )

  const handleChangeDataType = React.useCallback(
    (type: DataTypeType) => handleChange({ type: dataTypeFromDataTypeType(type) }),
    [handleChange],
  )

  const handleChangePrimaryKey = React.useCallback(
    (primaryKey: boolean) => handleChange({ primaryKey }),
    [handleChange],
  )

  const handleChangeRequired = React.useCallback(
    (required: boolean) => handleChange({ required }),
    [handleChange],
  )

  const handleChangeUnique = React.useCallback(
    (unique: boolean) => handleChange({ unique }),
    [handleChange],
  )

  const handleChangeUnsigned = React.useCallback(
    (unsigned: boolean) =>
      isNumberType(field.type) && handleChange({ type: { ...field.type, unsigned } }),
    [field.type, handleChange],
  )

  const handleChangeAutoincrement = React.useCallback(
    (autoincrement: boolean) =>
      isIntegerType(field.type) && handleChange({ type: { ...field.type, autoincrement } }),
    [field.type, handleChange],
  )

  const handleChangeStringLength = React.useCallback(
    (length: number | null = null) =>
      isStringType(field.type) && handleChange({ type: { ...field.type, length } }),
    [field.type, handleChange],
  )

  const handleChangePrecision = React.useCallback(
    (precision: number | null = null) => {
      if (!isNumericType(field.type)) return
      if (!precision) {
        handleChange({ type: { ...field.type, precision: null } })
        return
      }
      handleChange({
        type: {
          ...field.type,
          precision: field.type.precision
            ? { ...field.type.precision, precision }
            : { precision, scale: null },
        },
      })
    },
    [field.type, handleChange],
  )

  const handleChangeScale = React.useCallback(
    (scale: number | null = null) => {
      if (!isNumericType(field.type)) return
      if (!field.type.precision) return
      handleChange({ type: { ...field.type, precision: { ...field.type.precision, scale } } })
    },
    [field.type, handleChange],
  )

  const handleChangeUuidDefault = React.useCallback(
    (defaultVersion: UuidType | null = null) =>
      field.type.type === DataTypeType.Uuid &&
      handleChange({ type: { ...field.type, defaultVersion } }),
    [field.type, handleChange],
  )

  const handleChangeDefaultNow = React.useCallback(
    (defaultNow: boolean) =>
      isDateTimeType(field.type) && handleChange({ type: { ...field.type, defaultNow } }),
    [field.type, handleChange],
  )

  const handleDelete = React.useCallback(() => onDelete(field.id), [onDelete, field.id])

  return (
    <fieldset className={classnames(fieldsetGrid)}>
      <IconButton
        className={classnames(position('absolute'), inset('top-0', 'right-0'), padding('p-1'))}
        label="delete"
        icon={TrashIcon}
        iconProps={{ size: 6 }}
        onClick={handleDelete}
      />
      <TextInput
        id={fieldNameId(field)}
        className={classnames(gridColumn('col-span-12'))}
        label="Field name"
        value={field.name}
        error={errors?.name}
        onChange={handleChangeName}
      />
      <Select<DataTypeType>
        id={`field-type-${field.id}`}
        className={classnames(gridColumn('col-span-12', 'xs:col-span-6'))}
        label="Data type"
        options={DataTypeType}
        display={displayDataTypeType}
        value={field.type.type}
        onChange={handleChangeDataType}
      />
      <div
        className={classnames(
          gridColumn('col-span-12', 'xs:col-span-6'),
          gridRow('row-span-4'),
          margin('mb-4', 'xs:mb-0'),
          display('flex'),
        )}
      >
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
          <div
            className={classnames(
              display('flex'),
              flexDirection('flex-col'),
              justifyContent('justify-center'),
              alignSelf('self-start'),
              padding('pt-4'),
            )}
          >
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
        {field.type.type === DataTypeType.Enum && (
          <TextArea
            id={`field-enum-values-${field.id}`}
            label="Enum values"
            value={enumInputValue}
            rows={4}
            onChange={setEnumInputValue}
            onBlur={handleBlurEnumInput}
          />
        )}

        {isDateTimeType(field.type) && (
          <div
            className={classnames(
              display('flex'),
              flexDirection('flex-col'),
              justifyContent('justify-center'),
              alignSelf('self-start'),
              padding('pt-4'),
            )}
          >
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
          <IntegerInput
            id={`field-precision-${field.id}`}
            className={classnames(gridColumn('col-span-12', 'xs:col-span-6'))}
            label="Precision"
            value={field.type.precision?.precision}
            min={1}
            max={1000}
            onChange={handleChangePrecision}
          />
          <IntegerInput
            id={`field-scale-${field.id}`}
            className={classnames(gridColumn('col-span-12', 'xs:col-span-6'))}
            disabled={field.type.precision?.precision === undefined}
            label="Scale"
            value={field.type.precision?.scale}
            min={0}
            max={field.type.precision?.precision || 1000}
            onChange={handleChangeScale}
          />
        </>
      )}
      <div
        className={classnames(
          gridColumn('col-span-12', 'xs:col-span-6'),
          display('flex'),
          flexDirection('flex-col'),
        )}
      >
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
    </fieldset>
  )
}

export function fieldNameId(field: Field): string {
  return `field-name-${field.id}`
}

export default React.memo(FieldFieldset)
