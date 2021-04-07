import { emptyField } from '@lib/api/schema'
import { Field, Model } from '@lib/core'
import React from 'react'
import { classnames } from 'tailwindcss-classnames'
import FieldFieldset from './FieldFieldset'
import ModelFieldset from './ModelFieldset'

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

  const handleChangeModel = React.useCallback(
    (changes: Partial<Model>) => setFormModel((m) => ({ ...m, ...changes })),
    [setFormModel],
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

      <ModelFieldset model={model} onChange={handleChangeModel} />

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
