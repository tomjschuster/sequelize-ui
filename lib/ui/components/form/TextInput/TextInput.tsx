import React from 'react'
import { classnames } from 'tailwindcss-classnames'
import { CommonFieldProps, CommonInputProps } from '../shared/types'

type TextInputProps = CommonFieldProps & CommonInputProps<string>

function TextInput({ id, label, value, error, onChange }: TextInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.value || undefined),
    [onChange],
  )

  return (
    <>
      <label htmlFor={id} className={classnames('flex flex-col items-start')}>
        {label}
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={`${id}-alert`}
        />
      </label>
      <span id={`${id}-alert`} role={error ? 'alert' : undefined} aria-hidden={!error}>
        {error}
      </span>
    </>
  )
}

export default React.memo(TextInput)
