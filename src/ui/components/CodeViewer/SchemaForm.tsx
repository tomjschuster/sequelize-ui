import { Schema } from '@src/core/schema'
import { SchemaErrors } from '@src/core/validation/schema'
import React from 'react'
import TextInput from '../form/TextInput'

type SchemaFormProps = {
  schema: Schema
  errors: SchemaErrors
  onChange: (schema: Schema) => void
}
export default function SchemaForm({
  schema,
  errors,
  onChange,
}: SchemaFormProps): React.ReactElement {
  const handleChangeSchemaName = (name?: string): void => onChange({ ...schema, name: name || '' })

  return (
    <form onSubmit={(evt) => evt.preventDefault()}>
      <TextInput
        id="schema-name"
        label="Schema name"
        value={schema.name}
        error={errors.name}
        onChange={handleChangeSchemaName}
      />
    </form>
  )
}
