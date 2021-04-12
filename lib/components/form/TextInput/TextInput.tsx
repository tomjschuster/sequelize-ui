import React from 'react'
import { classnames } from 'tailwindcss-classnames'

type TextInputProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function TextInput({ id, label, value, onChange }: TextInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.value),
    [onChange],
  )

  return (
    <label htmlFor={id} className={classnames('flex flex-col items-start')}>
      {label}
      <input id={id} type="text" value={value} onChange={handleChange} />
    </label>
  )
}

export default React.memo(TextInput)
