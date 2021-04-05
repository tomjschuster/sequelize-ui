import { emptyField } from '@lib/api/schema'
import {
  dataTypeFromDataTypeType,
  DataTypeType,
  displayDataTypeType,
  Field,
  isDateTimeType,
  Model,
} from '@lib/core'
import React from 'react'
import { classnames } from 'tailwindcss-classnames'
import Checkbox from '../form/Checkbox'
import Select from '../form/Select'

type ModelFormProps = {
  model: Model
  onSubmit: (model: Model) => void
  onCancel: () => void
}

export default function ModelForm({
  model,
  onSubmit,
  onCancel,
}: ModelFormProps): React.ReactElement {
  const [formModel, setFormModel] = React.useState<Model>(model)

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    onSubmit(formModel)
  }

  const handleChangeName = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      setFormModel((s) => ({ ...s, name: evt.target.value })),
    [],
  )

  const handleChangeField = React.useCallback(
    (field: Field, changes: Partial<Field>) =>
      setFormModel((m) => ({
        ...m,
        fields: m.fields.map((f) => (f.id === field.id ? { ...f, ...changes } : f)),
      })),
    [setFormModel],
  )

  const handleClickAddField = React.useCallback(
    () => setFormModel((m) => ({ ...m, fields: [...m.fields, emptyField()] })),
    [],
  )

  return (
    <form onSubmit={handleSubmit} className={classnames('bg-white', 'inset-0', 'fixed', 'z-10')}>
      <h2>Edit Model</h2>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>

      <button type="submit">Save</button>

      <fieldset>
        <label htmlFor="model-name">
          Model name
          <input id="model-name" type="text" value={formModel.name} onChange={handleChangeName} />
        </label>
      </fieldset>

      <h3>Fields</h3>
      <button type="button" onClick={handleClickAddField}>
        Add field
      </button>

      {formModel.fields.map((field) => {
        return (
          <FieldFieldset
            key={`field-form-${field.id}`}
            field={field}
            onChange={handleChangeField}
          />
        )
      })}
    </form>
  )
}

type FieldFieldsetProps = {
  field: Field
  onChange: (field: Field, changes: Partial<Field>) => void
}
const FieldFieldset: React.FC<FieldFieldsetProps> = React.memo(({ field, onChange }) => {
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
})
