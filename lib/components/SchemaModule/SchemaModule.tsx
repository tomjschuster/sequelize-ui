import { Schema } from '@lib/core'
import React, { useState } from 'react'

type SchemaModuleProps = {
  schema: Schema
  onUpdate: (schema: Schema) => Promise<void>
}
export default function SchemaModule({ schema, onUpdate }: SchemaModuleProps): React.ReactElement {
  const [editing, setEditing] = useState<boolean>(false)
  const handleEdit = () => setEditing(true)
  const handleSubmit = async (schema: Schema): Promise<void> => {
    await onUpdate(schema)
    setEditing(false)
  }

  return editing ? (
    <SchemaForm schema={schema} onSubmit={handleSubmit} />
  ) : (
    <SchemaItem schema={schema} onEdit={handleEdit} />
  )
}

type SchemaItemProps = {
  schema: Schema
  onEdit: () => void
}

function SchemaItem({ schema, onEdit }: SchemaItemProps): React.ReactElement {
  return (
    <>
      <h2>{schema.name} schema</h2>
      <button onClick={onEdit}>Edit</button>
    </>
  )
}

type SchemaFormProps = {
  schema: Schema
  onSubmit: (schema: Schema) => void
}

function SchemaForm({ schema, onSubmit }: SchemaFormProps): React.ReactElement {
  const [formSchema, setFormSchema] = React.useState<Schema>(schema)

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    onSubmit(formSchema)
  }

  const handleChangeSchemaName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormSchema((s) => ({ ...s, name: evt.target.value }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="schema-name">
        Schema name
        <input
          id="schema-name"
          type="text"
          value={formSchema.name}
          onChange={handleChangeSchemaName}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  )
}
