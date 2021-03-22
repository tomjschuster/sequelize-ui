import { Field, Model, Schema } from '@lib/core'
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
          first={i === 0}
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
    <li onClick={onClick} key={model.name} className={styles.modelItem(first)}>
      {model.name}
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
  return <li key={field.name}>{field.name}</li>
}
