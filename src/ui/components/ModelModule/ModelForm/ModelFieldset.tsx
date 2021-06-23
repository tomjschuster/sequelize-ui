import { Model, ModelErrors } from '@src/core/schema'
import TextInput from '@src/ui/components/form/TextInput'
import React from 'react'

type ModelFieldsetProps = {
  name: Model['name']
  errors: ModelErrors
  onChange: (changes: Partial<Model>) => void
}

function ModelFieldset({ name, errors, onChange }: ModelFieldsetProps): React.ReactElement {
  const handleChangeName = React.useCallback((name?: string) => onChange({ name: name || '' }), [
    onChange,
  ])

  return (
    <fieldset>
      <TextInput
        id="model-name"
        label="Model name"
        value={name}
        error={errors.name}
        onChange={handleChangeName}
      />
    </fieldset>
  )
}

export default React.memo(ModelFieldset)
