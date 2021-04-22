import {
  displayDataType,
  Field,
  isIntegerType,
  isNumberType,
  isNumericType,
  isStringType,
  Model,
  Precision,
  Schema,
} from '@lib/core'
import { noCase, titleCase } from '@lib/core/utils'
import AssociationList from '@lib/ui/components/AssociationList'
import React, { useCallback, useState } from 'react'
import * as styles from './styles'

type ModelItemProps = {
  schema: Schema
  model: Model
  disabled: boolean
  onEdit: (id: Model['id']) => void
  onDelete: (id: Model['id']) => void
}
export default function ModelItem({
  schema,
  model,
  disabled,
  onEdit,
  onDelete,
}: ModelItemProps): React.ReactElement {
  const [expanded, setExpanded] = useState<boolean>(false)
  const handleClick = useCallback(() => !disabled && setExpanded((e) => !e), [disabled])
  const handleClickEdit = useCallback(() => onEdit(model.id), [model.id])

  const handleDelete = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault()
      onDelete(model.id)
    },
    [onDelete, model.id],
  )

  return (
    <li className={styles.modelItem}>
      <span className={styles.modelName(disabled)} onClick={handleClick}>
        {titleCase(model.name)}
      </span>

      {expanded && !disabled && (
        <>
          <button type="button" onClick={handleClickEdit} disabled={disabled}>
            Edit
          </button>
          <form onSubmit={handleDelete}>
            <button type="submit">Delete</button>
          </form>
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
      isStringType(field.type) ? displayLength(field.type.length) : undefined,
      isNumberType(field.type) && field.type.unsigned ? 'unsigned' : undefined,
      isIntegerType(field.type) && field.type.autoincrement ? 'autoincrement' : undefined,
      isNumericType(field.type) ? displayPrecision(field.type.precision) : undefined,
    ]
      .filter((x) => x)
      .join('; ') || undefined
  )
}

function displayLength(length?: number): string | undefined {
  return length ? `length: ${length}}` : undefined
}

function displayPrecision(precision?: Precision): string | undefined {
  return precision
    ? `precision: ${precision.precision}${precision.scale ? `,${precision.scale}` : ''}`
    : undefined
}
