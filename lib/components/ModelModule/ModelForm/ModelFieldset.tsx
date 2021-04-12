import TextInput from '@lib/components/form/TextInput'
import { Model } from '@lib/core'
import React from 'react'

type ModelFieldsetProps = {
  name: Model['name']
  onChange: (changes: Partial<Model>) => void
}

function ModelFieldset({ name, onChange }: ModelFieldsetProps): React.ReactElement {
  const handleChangeName = React.useCallback((name: string) => onChange({ name }), [onChange])

  return (
    <fieldset>
      <TextInput id="model-name" label="Model name" value={name} onChange={handleChangeName} />
    </fieldset>
  )
}

export default React.memo(ModelFieldset)
