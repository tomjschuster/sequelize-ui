import { Schema } from '@lib/core'
import React from 'react'
import TextInput from '../form/TextInput'

type SchemaModuleProps = {
  schema: Schema
  editing: boolean
  onEdit: () => void
  onUpdate: (schema: Schema) => void
  onCancel: () => void
}
export default function SchemaModule({
  schema,
  editing,
  onEdit,
  onUpdate,
  onCancel,
}: SchemaModuleProps): React.ReactElement {
  return editing ? (
    <SchemaForm schema={schema} onSubmit={onUpdate} onCancel={onCancel} />
  ) : (
    <SchemaItem schema={schema} onEdit={onEdit} />
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
  onCancel: () => void
}

function SchemaForm({ schema, onSubmit, onCancel }: SchemaFormProps): React.ReactElement {
  const [formSchema, setFormSchema] = React.useState<Schema>(schema)

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    onSubmit(formSchema)
  }

  const handleChangeSchemaName = (name: string): void => setFormSchema((s) => ({ ...s, name }))

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id="schema-name"
        label="Schema name"
        value={formSchema.name}
        onChange={handleChangeSchemaName}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}
