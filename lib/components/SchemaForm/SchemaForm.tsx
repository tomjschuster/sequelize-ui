import { Schema } from '@lib/core'
import React from 'react'

type SchemaFormProps = {
  schema: Schema
  onSubmit: (schema: Schema) => void
}

export default function SchemaForm({ schema, onSubmit }: SchemaFormProps): React.ReactElement {
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
