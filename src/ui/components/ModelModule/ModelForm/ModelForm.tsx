import { Association, emptyAssociation, emptyField, Field, Model, Schema } from '@src/core/schema'
import React from 'react'
import { classnames } from 'tailwindcss-classnames'
import AssociationFieldset from './AssociationFieldset'
import FieldFieldset from './FieldFieldset'
import ModelFieldset from './ModelFieldset'
import { emptyErrors, ModelFormErrors, noModelFormErrors, validateModel } from './validation'

type ModelFormProps = {
  model: Model
  schema: Schema
  onSubmit: (model: Model) => void
  onCancel: () => void
}

export default function ModelForm({
  model,
  schema,
  onSubmit,
  onCancel,
}: ModelFormProps): React.ReactElement {
  const [formModel, setFormModel] = React.useState<Model>(model)
  const [errors, setErrors] = React.useState<ModelFormErrors>(emptyErrors)

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const newErrors = validateModel(formModel, schema)
    setErrors(newErrors)
    if (noModelFormErrors(newErrors)) onSubmit(formModel)
  }

  const handleChangeModel = React.useCallback(
    (changes: Partial<Model>) => setFormModel((m) => ({ ...m, ...changes })),
    [setFormModel],
  )

  const handleChangeField = React.useCallback(
    (id: Field['id'], changes: Partial<Field>) =>
      setFormModel((m) => ({
        ...m,
        fields: m.fields.map((f) => (f.id === id ? { ...f, ...changes } : f)),
      })),
    [setFormModel],
  )

  const handleDeleteField = React.useCallback(
    (id: Field['id']) =>
      setFormModel((m) => ({
        ...m,
        fields: m.fields.filter((f) => f.id !== id),
      })),
    [setFormModel],
  )

  const handleChangeAssociation = React.useCallback(
    (id: Association['id'], changes: Partial<Association>) =>
      setFormModel((m) => ({
        ...m,
        associations: m.associations.map((a) => (a.id === id ? { ...a, ...changes } : a)),
      })),
    [setFormModel],
  )

  const handleDeleteAssociation = React.useCallback(
    (id: Association['id']) =>
      setFormModel((m) => ({
        ...m,
        associations: m.associations.filter((a) => a.id !== id),
      })),
    [setFormModel],
  )

  const handleClickAddField = React.useCallback(
    () => setFormModel((m) => ({ ...m, fields: [...m.fields, emptyField()] })),
    [],
  )

  const handleClickAddAssociation = React.useCallback(
    () =>
      setFormModel((m) => ({
        ...m,
        associations: [...m.associations, emptyAssociation(m.id, m.id)],
      })),
    [],
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={classnames('bg-white', 'inset-0', 'fixed', 'z-10', 'overflow-y-scroll')}
    >
      <h2>Edit Model</h2>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>

      <button type="submit">Save</button>

      <ModelFieldset name={formModel.name} onChange={handleChangeModel} errors={errors} />

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
            onDelete={handleDeleteField}
            errors={errors.fields[field.id]}
          />
        )
      })}

      <h3>Associations</h3>
      <button type="button" onClick={handleClickAddAssociation}>
        Add association
      </button>

      {formModel.associations.map((association) => (
        <AssociationFieldset
          key={`association-form-${association.id}`}
          association={association}
          schema={schema}
          model={formModel}
          onChange={handleChangeAssociation}
          onDelete={handleDeleteAssociation}
          errors={errors.associations[association.id]}
        />
      ))}
    </form>
  )
}
