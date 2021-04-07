import { Model } from '@lib/core'
import React from 'react'

type ModelFieldsetProps = {
  model: Model
  onChange: (changes: Partial<Model>) => void
}

function ModelFieldset({ model, onChange }: ModelFieldsetProps): React.ReactElement {
  const handleChangeName = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange({ name: evt.target.value }),
    [onChange],
  )

  return (
    <fieldset>
      <label htmlFor="model-name">
        Model name
        <input id="model-name" type="text" value={model.name} onChange={handleChangeName} />
      </label>
    </fieldset>
  )
}

export default React.memo(ModelFieldset)
