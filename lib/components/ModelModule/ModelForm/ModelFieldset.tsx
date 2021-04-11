import TextInput from '@lib/components/form/TextInput'
import { Model } from '@lib/core'
import React from 'react'

type ModelFieldsetProps = {
  model: Model
  onChange: (changes: Partial<Model>) => void
}

function ModelFieldset({ model, onChange }: ModelFieldsetProps): React.ReactElement {
  const handleChangeName = React.useCallback((name: string) => onChange({ name }), [onChange])

  return (
    <fieldset>
      <TextInput
        id="model-name"
        label="Model name"
        value={model.name}
        onChange={handleChangeName}
      />
    </fieldset>
  )
}

export default React.memo(ModelFieldset)
