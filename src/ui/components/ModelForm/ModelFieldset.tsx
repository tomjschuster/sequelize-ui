import { Model } from '@src/core/schema'
import { ModelErrors } from '@src/core/validation/schema'
import TextInput from '@src/ui/components/form/TextInput'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'

type ModelFieldsetProps = {
  name: Model['name']
  errors: ModelErrors
  onChange: (changes: Partial<Model>) => void
}

function ModelFieldset({ name, errors, onChange }: ModelFieldsetProps): React.ReactElement {
  const handleChangeName = React.useCallback(
    (name?: string) => onChange({ name: name || '' }),
    [onChange],
  )

  return (
    <fieldset className={classnames('w-full')}>
      <div className={classnames('sm:w-1/2')}>
        <TextInput
          id={modelNameId()}
          label="Name"
          value={name}
          error={errors.name}
          onChange={handleChangeName}
        />
      </div>
    </fieldset>
  )
}

export function modelNameId(): string {
  return 'model-name'
}

export default React.memo(ModelFieldset)
