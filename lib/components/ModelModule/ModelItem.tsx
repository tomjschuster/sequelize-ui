import AssociationList from '@lib/components/AssociationList'
import { DataTypeType, displayDataType, Field, Model, Schema } from '@lib/core'
import { noCase, titleCase } from '@lib/utils'
import React, { useState } from 'react'
import * as styles from './styles'

type ModelItemProps = {
  schema: Schema
  model: Model
  disabled: boolean
  onEdit: () => void
}
export default function ModelItem({
  schema,
  model,
  disabled,
  onEdit,
}: ModelItemProps): React.ReactElement {
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
