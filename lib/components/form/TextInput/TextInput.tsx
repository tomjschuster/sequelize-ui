import React from 'react'

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
    <label htmlFor={id}>
      {label}
      <input id={id} type="text" value={value} onChange={handleChange} />
    </label>
  )
}

export default React.memo(TextInput)
