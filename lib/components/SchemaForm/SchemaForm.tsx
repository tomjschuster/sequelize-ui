import { emptyModel } from '@lib/api/schema'
import { Model, Schema } from '@lib/core'
import React from 'react'
import { classnames } from 'tailwindcss-classnames'

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

  const handleModelNameChange = (model: Model, evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormSchema((s) => ({
      ...s,
      models: s.models.map((m) => (m.id === model.id ? { ...m, name: evt.target.value } : m)),
    }))
  }

  const handleClickAddModel = () =>
    setFormSchema((s) => ({ ...s, models: [emptyModel(), ...s.models] }))

  return (
    <form onSubmit={handleSubmit} className={classnames('bg-white', 'h-full')}>
      <fieldset>
        <label htmlFor="schema-name">
          Schema name
          <input
            id="schema-name"
            type="text"
            value={formSchema.name}
            onChange={handleChangeSchemaName}
          />
        </label>
      </fieldset>
      <button type="button" onClick={handleClickAddModel}>
        Add model
      </button>
      {formSchema.models.map((model) => {
        return (
          <fieldset key={model.id}>
            <label htmlFor="model">
              Model name
              <input
                type="text"
                value={model.name}
                onChange={handleModelNameChange.bind(null, model)}
              />
            </label>
          </fieldset>
        )
      })}
      <button type="submit">Submit</button>
    </form>
  )
}
