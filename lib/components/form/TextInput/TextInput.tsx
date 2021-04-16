import React from 'react'
import { classnames } from 'tailwindcss-classnames'

type TextInputProps = {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
}

function TextInput({ id, label, value, error, onChange }: TextInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.value),
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
