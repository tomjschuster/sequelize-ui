import {
  dataTypeFromDataTypeType,
  DataTypeType,
  DefaultJsonValue,
  displayDataTypeType,
  displayDefaultJsonValue,
  Field,
  isDateTimeType,
  isIntegerType,
  isJsonDataType,
  isNumberType,
  isNumericType,
  isStringType,
  isTextDataType,
  UuidType,
} from '@src/core/schema'
import { FieldErrors } from '@src/core/validation/schema'
import Checkbox from '@src/ui/components/form/Checkbox'
import NumberInput from '@src/ui/components/form/NumberInput'
import Select from '@src/ui/components/form/Select'
import TextInput from '@src/ui/components/form/TextInput'
import TrashIcon from '@src/ui/components/icons/Trash'
import {
  classnames,
  display,
  flexDirection,
  gap,
  gridColumn,
  gridTemplateColumns,
  inset,
  margin,
  padding,
  position,
} from '@src/ui/styles/classnames'
import { fieldsetGrid } from '@src/ui/styles/utils'
import { dedup } from '@src/utils/array'
import React from 'react'
import IconButton from '../form/IconButton'

type FieldFieldsetProps = {
  field: Field
  errors?: FieldErrors
  onChange: (id: Field['id'], changes: Partial<Field>) => void
  onDelete: (id: Field['id']) => void
}
function FieldFieldset({ field, errors, onChange, onDelete }: FieldFieldsetProps) {
  const [enumInputValue, setEnumInputValue] = React.useState<string | undefined>(() =>
    field.type.type === DataTypeType.Enum ? field.type.values.join(', ') : undefined,
  )

  const handleChange = React.useCallback(
    (change: Partial<Field>): void => onChange(field.id, change),
    [field.id, onChange],
  )

  const handleBlurEnumInput = React.useCallback(() => {
    if (field.type.type === DataTypeType.Enum) {
      const values = dedup(
        enumInputValue
          // clear leading/tracing non-word characters and any non-(word|space|-|;|,)
          ?.replaceAll(/^\W+|[^\w\n -,;]|\W+$/g, '')
          // split on , ; \n
          .split(/[ ]*,[ ]*|[ ]*;[ ]*|[ ]*\n[ ]*/)
          .map((v) => v.trim())
          .filter((v) => !!v) || [],
      )

      handleChange({ type: { ...field.type, values } })
      setEnumInputValue(values.join(', '))
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

  const handleChangeDefaultText = React.useCallback(
    (value: string | undefined) =>
      isStringType(field.type) &&
      handleChange({ type: { ...field.type, defaultValue: value ?? null } }),
    [field.type, handleChange],
  )

  const handleChangeDefaultNumber = React.useCallback(
    (value: number | undefined) =>
      isNumberType(field.type) &&
      handleChange({ type: { ...field.type, defaultValue: value ?? null } }),
    [field.type, handleChange],
  )

  const handleChangeDefaultBoolean = React.useCallback(
    (value: boolean | null) =>
      field.type.type == DataTypeType.Boolean &&
      handleChange({ type: { ...field.type, defaultValue: value } }),
    [field.type, handleChange],
  )

  const handleChangeDateTimeDefault = React.useCallback(
    (defaultNow: boolean) =>
      isDateTimeType(field.type) && handleChange({ type: { ...field.type, defaultNow } }),
    [field.type, handleChange],
  )

  const handleChangeDefaultEnum = React.useCallback(
    (value: string | null = null) => {
      if (field.type.type !== DataTypeType.Enum) return
      const defaultValue = value !== null && field.type.values.includes(value) ? value : null
      handleChange({ type: { ...field.type, defaultValue } })
    },
    [field.type, handleChange],
  )

  const handleChangeDefaultUuid = React.useCallback(
    (defaultVersion: UuidType | null = null) =>
      field.type.type === DataTypeType.Uuid &&
      handleChange({ type: { ...field.type, defaultVersion } }),
    [field.type, handleChange],
  )

  const handleChangeDefaultJson = React.useCallback(
    (value: DefaultJsonValue | null = null) =>
      isJsonDataType(field.type) && handleChange({ type: { ...field.type, defaultValue: value } }),
    [field.type, handleChange],
  )

  const handleChangeArrayType = React.useCallback(
    (type: DataTypeType) =>
      field.type.type === DataTypeType.Array &&
      handleChange({ type: { ...field.type, arrayType: dataTypeFromDataTypeType(type) } }),
    [field.type, handleChange],
  )

  const handleChangeDefaultArray = React.useCallback(
    (defaultEmptyArray: boolean) =>
      field.type.type === DataTypeType.Array &&
      handleChange({ type: { ...field.type, defaultEmptyArray } }),
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
        fixedErrorContainer
        onChange={handleChangeName}
      />
      <Select<DataTypeType>
        id={`field-type-${field.id}`}
        className={classnames(gridColumn('col-span-12'), margin('mb-4'))}
        label="Data type"
        options={DataTypeType}
        display={displayDataTypeType}
        value={field.type.type}
        onChange={handleChangeDataType}
      />
      <div
        className={classnames(
          display('grid'),
          gridTemplateColumns('grid-cols-12'),
          gridColumn('col-span-12', 'xs:col-span-12'),
          gap('gap-y-0', 'gap-x-1'),
        )}
      >
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
        <div
          className={classnames(
            margin('mt-2', 'xs:mt-0'),
            gridColumn('col-span-12', 'xs:col-span-6'),
            flexDirection('flex-col'),
          )}
        >
          {isTextDataType(field.type) && (
            <TextInput
              id={`field-default-text-${field.id}`}
              label="Default"
              value={field.type.defaultValue}
              onChange={handleChangeDefaultText}
            />
          )}
          {isNumberType(field.type) && (
            <NumberInput
              id={`field-default-number-${field.id}`}
              label="Default"
              value={field.type.defaultValue}
              min={field.type.unsigned ? 0 : undefined}
              allowDecimals={!isIntegerType(field.type)}
              onChange={handleChangeDefaultNumber}
            />
          )}
          {field.type.type == DataTypeType.Boolean && (
            <Select<boolean | null>
              id={`field-default-boolean-${field.id}`}
              label="Default"
              value={field.type.defaultValue}
              options={[
                ['none', null],
                ['true', true],
                ['false', false],
              ]}
              onChange={handleChangeDefaultBoolean}
            />
          )}
          {isDateTimeType(field.type) && (
            <Checkbox
              id={`field-default-now-${field.id}`}
              label="Default to now"
              checked={!!field.type.defaultNow}
              onChange={handleChangeDateTimeDefault}
            />
          )}
          {field.type.type === DataTypeType.Enum && (
            <Select<string | null>
              id={`field-default-enum-${field.id}`}
              label="Default"
              options={[['none', null], ...field.type.values.map<[string, string]>((v) => [v, v])]}
              value={field.type.defaultValue}
              onChange={handleChangeDefaultEnum}
            />
          )}
          {field.type.type === DataTypeType.Uuid && (
            <Select<UuidType | null>
              id={`field-default-uuid-${field.id}`}
              label="Default"
              options={[
                ['none', null],
                [UuidType.V1, UuidType.V1],
                [UuidType.V4, UuidType.V4],
              ]}
              value={field.type.defaultVersion}
              display={(v) => `${v ? `UUID ${v}` : 'none'}`}
              onChange={handleChangeDefaultUuid}
            />
          )}
          {isJsonDataType(field.type) && (
            <Select<DefaultJsonValue | null>
              id={`field-default-json-${field.id}`}
              label="Default"
              options={[
                ['none', null],
                ['empty-object', DefaultJsonValue.EmptyObject],
                ['empty-array', DefaultJsonValue.EmptyArray],
              ]}
              value={field.type.defaultValue}
              display={(v) => (v ? displayDefaultJsonValue(v) : 'none')}
              onChange={handleChangeDefaultJson}
            />
          )}
          {field.type.type == DataTypeType.Array && (
            <Checkbox
              id={`field-default-array-${field.id}`}
              label="Default to empty"
              checked={!!field.type.defaultEmptyArray}
              onChange={handleChangeDefaultArray}
            />
          )}
        </div>
      </div>
      <div
        className={classnames(
          gridColumn('col-span-12', 'xs:col-span-12'),
          margin('mt-2', 'xs:mt-4'),
          display('grid'),
          gridTemplateColumns('grid-cols-12'),
          gap('gap-y-0', 'gap-x-1'),
        )}
      >
        {field.type.type === DataTypeType.String && (
          <NumberInput
            id={`field-string-length-${field.id}`}
            className={classnames(gridColumn('col-span-12', 'xs:col-span-6'))}
            label="Length"
            value={field.type.length}
            min={1}
            max={65535}
            onChange={handleChangeStringLength}
          />
        )}

        {isIntegerType(field.type) && (
          <Checkbox
            id={`field-autoincrement-${field.id}`}
            className={classnames(gridColumn('col-span-6'))}
            label="Autoincrement"
            checked={!!field.type.autoincrement}
            onChange={handleChangeAutoincrement}
          />
        )}
        {isNumericType(field.type) && (
          <>
            <NumberInput
              id={`field-precision-${field.id}`}
              className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
              disabled={field.type.precision?.precision === undefined}
              label="Precision"
              value={field.type.precision?.precision}
              min={1}
              max={1000}
              onChange={handleChangePrecision}
            />
            <NumberInput
              id={`field-scale-${field.id}`}
              className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
              disabled={field.type.precision?.precision === undefined}
              label="Scale"
              value={field.type.precision?.scale}
              min={0}
              max={field.type.precision?.precision || 1000}
              onChange={handleChangeScale}
            />
          </>
        )}
        {isNumberType(field.type) && (
          <Checkbox
            id={`field-unsigned-${field.id}`}
            className={classnames(gridColumn('col-span-12', 'xs:col-span-6'))}
            label="Unsigned"
            checked={!!field.type.unsigned}
            onChange={handleChangeUnsigned}
          />
        )}
        {field.type.type === DataTypeType.Enum && (
          <TextInput
            id={`field-enum-values-${field.id}`}
            label="Enum values"
            className={classnames(gridColumn('col-span-12'))}
            value={enumInputValue}
            onChange={setEnumInputValue}
            onBlur={handleBlurEnumInput}
          />
        )}
        {field.type.type == DataTypeType.Array && (
          <Select<DataTypeType>
            id={`field-array-type-${field.id}`}
            className={classnames(gridColumn('col-span-6'))}
            label="Array type"
            options={DataTypeType}
            display={displayDataTypeType}
            value={field.type.arrayType.type}
            onChange={handleChangeArrayType}
          />
        )}
      </div>
    </fieldset>
  )
}

export function fieldNameId(field: Field): string {
  return `field-name-${field.id}`
}

export default React.memo(FieldFieldset)
