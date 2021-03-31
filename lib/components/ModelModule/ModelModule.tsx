import { emptyField } from '@lib/api/schema'
import AssociationList from '@lib/components/AssociationList'
import {
  dataTypeFromDataTypeType,
  DataTypeType,
  displayDataType,
  displayDataTypeType,
  Field,
  isDateTimeType,
  Model,
  Schema,
} from '@lib/core'
import { noCase, titleCase } from '@lib/utils'
import React, { useState } from 'react'
import { classnames } from 'tailwindcss-classnames'
import Checkbox from '../Checkbox'
import EnumSelect from '../EnumSelect'
import * as styles from './styles'

type ModelModuleProps = {
  schema: Schema
  model: Model
  editing: boolean
  disabled: boolean
  onRequestEdit: () => void
  onChange: (model: Model) => Promise<void>
  onRequestCancel: () => void
}
export default function ModelModule({
  schema,
  model,
  editing,
  disabled,
  onChange,
  onRequestEdit,
  onRequestCancel,
}: ModelModuleProps): React.ReactElement {
  return editing ? (
    <ModelForm model={model} onSubmit={onChange} onCancel={onRequestCancel} />
  ) : (
    <ModelItem disabled={disabled} schema={schema} model={model} onEdit={onRequestEdit} />
  )
}

type ModelItemProps = {
  schema: Schema
  model: Model
  disabled: boolean
  onEdit: () => void
}
export function ModelItem({ schema, model, disabled, onEdit }: ModelItemProps): React.ReactElement {
  const [expanded, setExpanded] = useState<boolean>(false)
  const handleClick = () => !disabled && setExpanded((e) => !e)
  return (
    <li className={styles.modelItem} onClick={handleClick}>
      <span className={styles.modelName(disabled)}>{titleCase(model.name)}</span>

      {expanded && !disabled && (
        <>
          <button type="button" onClick={onEdit} disabled={disabled}>
            Edit
          </button>
          <p>Fields</p>
          <FieldList fields={model.fields} />
          <p>Associations</p>
          <AssociationList schema={schema} modelId={model.id} />
        </>
      )}
    </li>
  )
}

type FieldListProps = {
  fields: Field[]
}
export function FieldList({ fields }: FieldListProps): React.ReactElement {
  return (
    <ul className={styles.fieldList}>
      {fields.map((f) => (
        <FieldItem key={`field-item-${f.id}`} field={f} />
      ))}
    </ul>
  )
}

type FieldItemProps = {
  field: Field
}
export function FieldItem({ field }: FieldItemProps): React.ReactElement {
  const attributes = fieldAttributes(field)
  return (
    <li>
      <span>{noCase(field.name)}: </span>
      <span>{displayDataType(field.type)}</span>
      {attributes ? ` (${attributes})` : undefined}
    </li>
  )
}

function fieldAttributes(field: Field): string | undefined {
  return (
    [
      field.primaryKey ? 'primary key' : undefined,
      field.required ? 'required' : undefined,
      field.unique ? 'unique' : undefined,
      field.type.type === DataTypeType.Integer && field.type.autoincrement
        ? 'autoincrement'
        : undefined,
    ]
      .filter((x) => x)
      .join(', ') || undefined
  )
}

type ModelFormProps = {
  model: Model
  onSubmit: (model: Model) => void
  onCancel: () => void
}

function ModelForm({ model, onSubmit, onCancel }: ModelFormProps): React.ReactElement {
  const [formModel, setFormModel] = React.useState<Model>(model)

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    onSubmit(formModel)
  }

  const handleChangeName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormModel((s) => ({ ...s, name: evt.target.value }))
  }

  const handleChangeField = (field: Field, changes: Partial<Field>) =>
    setFormModel((m) => ({
      ...m,
      fields: m.fields.map((f) => (f.id === field.id ? { ...f, ...changes } : f)),
    }))

  const handleChangeFieldName = (field: Field, evt: React.ChangeEvent<HTMLInputElement>) =>
    handleChangeField(field, { name: evt.target.value })

  const handleChangeFieldDataType = (field: Field, type: DataTypeType) =>
    handleChangeField(field, { type: dataTypeFromDataTypeType(type) })

  const handleChangeFieldPrimaryKey = (field: Field, primaryKey: boolean) =>
    handleChangeField(field, { primaryKey })

  const handleChangeFieldRequired = (field: Field, required: boolean) =>
    handleChangeField(field, { required })

  const handleChangeFieldUnique = (field: Field, unique: boolean) =>
    handleChangeField(field, { unique })

  const handleChangeFieldAutoincrement = (field: Field, autoincrement: boolean) =>
    handleChangeField(field, {
      type:
        field.type.type === DataTypeType.Integer ? { ...field.type, autoincrement } : field.type,
    })

  const handleChangeFieldDefaultNow = (field: Field, defaultNow: boolean) =>
    handleChangeField(field, {
      type: isDateTimeType(field.type) ? { ...field.type, defaultNow } : field.type,
    })

  const handleClickAddField = () =>
    setFormModel((m) => ({ ...m, fields: [...m.fields, emptyField()] }))

  return (
    <form onSubmit={handleSubmit} className={classnames('bg-white', 'inset-0', 'fixed', 'z-10')}>
      <h2>Edit Model</h2>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit">Save</button>

      <fieldset>
        <label htmlFor="schema-name">
          Model name
          <input id="schema-name" type="text" value={formModel.name} onChange={handleChangeName} />
        </label>
      </fieldset>

      <h3>Fields</h3>
      <button type="button" onClick={handleClickAddField}>
        Add field
      </button>
      {formModel.fields.map((field) => {
        return (
          <fieldset key={`field-form-${field.id}`}>
            <label htmlFor={`field-name-${field.id}`}>
              Field name
              <input
                id={`field-name-${field.id}`}
                type="text"
                value={field.name}
                onChange={handleChangeFieldName.bind(null, field)}
              />
            </label>

            <EnumSelect
              id={`field-type-${field.id}`}
              label="Data type"
              enumConst={DataTypeType}
              display={displayDataTypeType}
              value={field.type.type}
              onChange={handleChangeFieldDataType.bind(null, field)}
            />
            {field.type.type === DataTypeType.Integer && (
              <Checkbox
                id={`field-autoincrement-${field.id}`}
                label="Autoincrement"
                checked={!!field.type.autoincrement}
                onChange={handleChangeFieldAutoincrement.bind(null, field)}
              />
            )}

            {isDateTimeType(field.type) && (
              <Checkbox
                id={`field-default-now-${field.id}`}
                label="Default to now"
                checked={!!field.type.defaultNow}
                onChange={handleChangeFieldDefaultNow.bind(null, field)}
              />
            )}
            <Checkbox
              id={`field-pk-${field.id}`}
              label="Primary key"
              checked={!!field.primaryKey}
              onChange={handleChangeFieldPrimaryKey.bind(null, field)}
            />
            <Checkbox
              id={`field-required-${field.id}`}
              label="Required"
              checked={!!field.required}
              onChange={handleChangeFieldRequired.bind(null, field)}
            />
            <Checkbox
              id={`field-unique-${field.id}`}
              label="Unique"
              checked={!!field.unique}
              onChange={handleChangeFieldUnique.bind(null, field)}
            />
          </fieldset>
        )
      })}
    </form>
  )
}
