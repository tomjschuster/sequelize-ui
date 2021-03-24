import { displayDataType, Field, Model, Schema } from '@lib/core'
import React, { useState } from 'react'
import * as styles from './styles'

type ModelListProps = {
  schema: Schema
}
export default function ModelList({ schema }: ModelListProps): React.ReactElement {
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({})

  return (
    <ul className={styles.modelList}>
      {schema.models.map((m, i) => (
        <ModelItem
          key={m.name}
          model={m}
          expanded={!!expanded[m.id]}
          first={i === schema.models.length - 1}
          onClick={() => setExpanded((x) => ({ ...x, [m.id]: !x[m.id] }))}
        />
      ))}
    </ul>
  )
}

type ModelItemProps = {
  model: Model
  expanded: boolean
  first: boolean
  onClick: () => void
}
export function ModelItem({ model, expanded, first, onClick }: ModelItemProps): React.ReactElement {
  return (
    <li className={styles.modelItem(first)} onClick={onClick} key={model.name}>
      <span className={styles.modelName}>{model.name}</span>
      {expanded && <FieldList fields={model.fields} />}
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
        <FieldItem key={f.name} field={f} />
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
    <li key={field.name}>
      <span>{field.name}: </span>
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
    ]
      .filter((x) => x)
      .join(', ') || undefined
  )
}
