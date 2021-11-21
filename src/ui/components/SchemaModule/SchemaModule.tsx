import { Schema } from '@src/core/schema'
import {
  emptySchemaErrors,
  noSchemaErrors,
  SchemaErrors,
  validateSchema,
} from '@src/core/validation/schema'
import React from 'react'
import TextInput from '../form/TextInput'

type SchemaModuleProps = {
  schema: Schema
  schemas: Schema[]
  editing: boolean
  onEdit: () => void
  onUpdate: (schema: Schema) => void
  onCancel: () => void
}
export default function SchemaModule({
  schema,
  schemas,
  editing,
  onEdit,
  onUpdate,
  onCancel,
}: SchemaModuleProps): React.ReactElement {
  return editing ? (
    <SchemaForm schema={schema} schemas={schemas} onSubmit={onUpdate} onCancel={onCancel} />
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
  schemas: Schema[]
  onSubmit: (schema: Schema) => void
  onCancel: () => void
}

function SchemaForm({ schema, schemas, onSubmit, onCancel }: SchemaFormProps): React.ReactElement {
  const [formSchema, setFormSchema] = React.useState<Schema>(schema)

  const [errors, setErrors] = React.useState<SchemaErrors>(emptySchemaErrors)

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const newErrors = validateSchema(formSchema, schemas)
    setErrors(newErrors)
    if (noSchemaErrors(newErrors)) onSubmit(formSchema)
  }

  const handleChangeSchemaName = (name?: string): void =>
    setFormSchema((s) => ({ ...s, name: name || '' }))

  return (
    <form autoComplete="off" data-lpignore="true" data-form-type="other" onSubmit={handleSubmit}>
      <TextInput
        id="schema-name"
        label="Schema name"
        value={formSchema.name}
        error={errors.name}
        onChange={handleChangeSchemaName}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}
