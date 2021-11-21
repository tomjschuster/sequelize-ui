import { Association, emptyAssociation, emptyField, Field, Model, Schema } from '@src/core/schema'
import { ModelErrors } from '@src/core/validation/schema'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { newButton } from '../home/MySchemaLinks/styles'
import PlusCircleIcon from '../icons/Plus'
import AssociationFieldset from './AssociationFieldset'
import FieldFieldset from './FieldFieldset'
import ModelFieldset from './ModelFieldset'

export const section = classnames(
  'max-w-screen-lg',
  'flex',
  'flex-col',
  'mx-auto',
  'mb-6',
  'last:mb-0',
)

export const title = classnames('text-2xl', 'mb-2')

const grid = classnames(
  'grid',
  'lg:grid-cols-3',
  'md:grid-cols-2',
  'sm:grid-cols-2',
  'grid-cols-1',
  'gap-6',
  'auto-rows-fr',
  'w-full',
)
const panel = classnames('border', 'border-gray-400', 'bg-white', 'rounded')

type ModelFormProps = {
  model: Model
  schema: Schema
  errors: ModelErrors
  onChange: (model: Model) => void
}

export default function ModelForm({
  model,
  schema,
  errors,
  onChange,
}: ModelFormProps): React.ReactElement {
  const handleChangeModel = React.useCallback(
    (changes: Partial<Model>) => onChange({ ...model, ...changes }),
    [model, onChange],
  )

  const handleChangeField = React.useCallback(
    (id: Field['id'], changes: Partial<Field>) =>
      onChange({
        ...model,
        fields: model.fields.map((f) => (f.id === id ? { ...f, ...changes } : f)),
      }),
    [model, onChange],
  )

  const handleDeleteField = React.useCallback(
    (id: Field['id']) =>
      onChange({
        ...model,
        fields: model.fields.filter((f) => f.id !== id),
      }),
    [model, onChange],
  )

  const handleChangeAssociation = React.useCallback(
    (id: Association['id'], changes: Partial<Association>) =>
      onChange({
        ...model,
        associations: model.associations.map((a) => (a.id === id ? { ...a, ...changes } : a)),
      }),
    [model, onChange],
  )

  const handleDeleteAssociation = React.useCallback(
    (id: Association['id']) =>
      onChange({
        ...model,
        associations: model.associations.filter((a) => a.id !== id),
      }),
    [model, onChange],
  )

  const handleClickAddField = React.useCallback(
    () => onChange({ ...model, fields: [...model.fields, emptyField()] }),
    [model, onChange],
  )

  const handleClickAddAssociation = React.useCallback(
    () =>
      onChange({
        ...model,
        associations: [...model.associations, emptyAssociation(model.id, model.id)],
      }),
    [model, onChange],
  )

  return (
    <form
      onSubmit={(evt) => evt.preventDefault()}
      autoComplete="off"
      data-lpignore="true"
      data-form-type="other"
      className={classnames('p-6', 'pt-8')}
    >
      <div className={classnames(section)}>
        <h2 className={classnames(title)}>Model</h2>
        <ModelFieldset name={model.name} onChange={handleChangeModel} errors={errors} />
      </div>
      <div className={classnames(section)}>
        <h3 className={classnames(title)}>Fields</h3>

        <div className={classnames(grid)}>
          {model.fields.map((field) => {
            return (
              <div key={`field-form-${field.id}`} className={classnames(panel)}>
                <FieldFieldset
                  field={field}
                  onChange={handleChangeField}
                  onDelete={handleDeleteField}
                  errors={errors.fields[field.id]}
                />
              </div>
            )
          })}
          <button type="button" className={newButton} onClick={handleClickAddField}>
            <span>
              <PlusCircleIcon />
            </span>
            Add Field
          </button>
        </div>
      </div>

      <div className={classnames(section)}>
        <h3 className={classnames(title)}>Associations</h3>

        <div className={grid}>
          {model.associations.map((association) => (
            <div key={`association-form-${association.id}`} className={classnames(panel)}>
              <AssociationFieldset
                association={association}
                schema={schema}
                model={model}
                onChange={handleChangeAssociation}
                onDelete={handleDeleteAssociation}
                errors={errors.associations[association.id]}
              />
            </div>
          ))}
          <button type="button" className={newButton} onClick={handleClickAddAssociation}>
            <span>
              <PlusCircleIcon />
            </span>
            Add association
          </button>
        </div>
      </div>
    </form>
  )
}
