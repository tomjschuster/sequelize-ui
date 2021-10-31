import { Association, emptyAssociation, emptyField, Field, Model, Schema } from '@src/core/schema'
import {
  emptyModelErrors,
  ModelErrors,
  noModelErrors,
  validateModel,
} from '@src/core/validation/schema'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import Flyout from '../../Flyout'
import { newButton } from '../../home/MySchemaLinks/styles'
import PlusCircleIcon from '../../icons/Plus'
import AssociationFieldset from './AssociationFieldset'
import FieldFieldset from './FieldFieldset'
import ModelFieldset from './ModelFieldset'
import ModelFormControls from './ModelFormControls'

export const section = classnames(
  'max-w-screen-lg',
  'px-6',
  'flex',
  'flex-col',
  'mx-auto',
  'mb-6',
  'last:mb-0',
)

export const title = classnames('text-xl', 'mb-2')

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
const panel = classnames('border', 'border-gray-400', 'rounded')

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
  const [errors, setErrors] = React.useState<ModelErrors>(emptyModelErrors)

  const handleSubmit = () => {
    const newErrors = validateModel(formModel, schema)
    setErrors(newErrors)
    if (noModelErrors(newErrors)) onSubmit(formModel)
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
    <Flyout
      title={`${schema.name} > ${model.name}`}
      onClickClose={onCancel}
      controls={<ModelFormControls onClickCancel={onCancel} onClickSave={handleSubmit} />}
    >
      <form onSubmit={(evt) => evt.preventDefault()} className={classnames('bg-white', 'p-4')}>
        <div className={classnames(section)}>
          <h3 className={classnames(title)}>Model</h3>
          <ModelFieldset name={formModel.name} onChange={handleChangeModel} errors={errors} />
        </div>
        <div className={classnames(section)}>
          <h3 className={classnames(title)}>Fields</h3>

          <div className={classnames(grid)}>
            {formModel.fields.map((field) => {
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
            {formModel.associations.map((association) => (
              <div key={`association-form-${association.id}`} className={classnames(panel)}>
                <AssociationFieldset
                  association={association}
                  schema={schema}
                  model={formModel}
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
    </Flyout>
  )
}
