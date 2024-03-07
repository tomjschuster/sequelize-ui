import { Model } from '@src/core/schema'
import { ModelErrors } from '@src/core/validation/schema'
import TextInput from '@src/ui/components/form/TextInput'
import { alignItems, classnames, display, margin, width } from '@src/ui/styles/classnames'
import React from 'react'
import { flexDirection } from 'tailwindcss-classnames'
import Checkbox from '../form/Checkbox'

type ModelFieldsetProps = {
  model: Model
  errors: ModelErrors
  onChange: (changes: Partial<Model>) => void
}

function ModelFieldset({ model, errors, onChange }: ModelFieldsetProps): React.ReactElement {
  const handleChangeName = React.useCallback(
    (name?: string) => onChange({ name: name || '' }),
    [onChange],
  )

  const handleChangeSoftDelete = React.useCallback(
    (softDelete: boolean) => onChange({ softDelete }),
    [onChange],
  )

  return (
    <fieldset
      className={classnames(
        width('w-full'),
        display('flex'),
        flexDirection('flex-col', 'sm:flex-row'),
        alignItems('sm:items-center'),
      )}
    >
      <div className={classnames(width('sm:w-1/2'))}>
        <TextInput
          id={modelNameId()}
          label="Name"
          value={model.name}
          error={errors.name}
          fixedErrorContainer
          onChange={handleChangeName}
        />
      </div>
      <div className={classnames(width('sm:w-1/2'), margin('mb-4', 'sm:mb-0', 'sm:ml-4'))}>
        <Checkbox
          id={'model-soft-delete'}
          label="Soft delete"
          checked={model.softDelete}
          onChange={handleChangeSoftDelete}
        />
      </div>
    </fieldset>
  )
}

export function modelNameId(): string {
  return 'model-name'
}

export default React.memo(ModelFieldset)
