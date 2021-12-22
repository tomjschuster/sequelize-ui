import { Association, emptyAssociation, emptyField, Field, Model, Schema } from '@src/core/schema'
import { ModelErrors } from '@src/core/validation/schema'
import usePrevious from '@src/ui/hooks/usePrevious'
import { backgroundColor, classnames, margin, padding } from '@src/ui/styles/classnames'
import { panel, panelGrid, section, title } from '@src/ui/styles/utils'
import { focusById } from '@src/utils/dom'
import React from 'react'
import PanelButton from '../form/PanelButton'
import { autofillDisable } from '../form/shared/utils'
import PlusCircleIcon from '../icons/Plus'
import AssociationFieldset, { associationTypeId } from './AssociationFieldset'
import FieldFieldset, { fieldNameId } from './FieldFieldset'
import ModelFieldset, { modelNameId } from './ModelFieldset'

type ModelFormProps = {
  model: Model
  schema: Schema
  newField?: boolean
  newAssociation?: boolean
  initialField?: Field
  errors: ModelErrors
  onChange: (model: Model) => void
}

export default function ModelForm({
  model,
  schema,
  newField,
  newAssociation,
  initialField,
  errors,
  onChange,
}: ModelFormProps): React.ReactElement {
  const prevModel = usePrevious(model)

  React.useEffect(() => {
    if (newField) {
      handleClickAddField()
      return
    }

    if (newAssociation) {
      handleClickAddAssociation()
      return
    }

    if (initialField) {
      focusById(fieldNameId(initialField))
      return
    }

    focusById(modelNameId())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const addedField =
      prevModel && model.fields.length > prevModel.fields.length
        ? model.fields[model.fields.length - 1]
        : undefined

    if (addedField) {
      focusById(fieldNameId(addedField))
    }
  }, [model, prevModel])

  React.useEffect(() => {
    const association =
      prevModel && model.associations.length > prevModel.associations.length
        ? model.associations[model.associations.length - 1]
        : undefined

    if (association) {
      focusById(associationTypeId(association))
    }
  }, [model, prevModel])

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
      className={classnames(padding('p-6', 'pt-11'))}
      {...autofillDisable}
    >
      <div className={classnames(section)}>
        <h2 className={classnames(title)}>Model</h2>
        <ModelFieldset name={model.name} onChange={handleChangeModel} errors={errors} />
      </div>
      <div className={classnames(section, margin('mb-6'))}>
        <h3 className={classnames(title)}>Fields</h3>

        <ul className={classnames(panelGrid)}>
          {model.fields.map((field) => {
            return (
              <li key={`field-form-${field.id}`} className={classnames(panel)}>
                <FieldFieldset
                  field={field}
                  onChange={handleChangeField}
                  onDelete={handleDeleteField}
                  errors={errors.fields[field.id]}
                />
              </li>
            )
          })}
          <li>
            <PanelButton
              label="Add Field"
              className={classnames(backgroundColor('hover:bg-green-50'))}
              icon={PlusCircleIcon}
              iconProps={{ size: 6 }}
              onClick={handleClickAddField}
            />
          </li>
        </ul>
      </div>

      <div className={classnames(section)}>
        <h3 className={classnames(title)}>Associations</h3>

        <ul className={panelGrid}>
          {model.associations.map((association) => (
            <li key={`association-form-${association.id}`} className={classnames(panel)}>
              <AssociationFieldset
                association={association}
                schema={schema}
                model={model}
                onChange={handleChangeAssociation}
                onDelete={handleDeleteAssociation}
                errors={errors.associations[association.id]}
              />
            </li>
          ))}
          <li>
            <PanelButton
              label="Add association"
              className={classnames(backgroundColor('hover:bg-green-50'))}
              icon={PlusCircleIcon}
              iconProps={{ size: 6 }}
              onClick={handleClickAddAssociation}
            />
          </li>
        </ul>
      </div>
    </form>
  )
}
