import React from 'react'

type CheckboxProps = {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Checkbox({ id, label, checked, onChange }: CheckboxProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.checked),
    [onChange],
  )

  return (
    <label htmlFor={id}>
      {label}
      <input id={id} type="checkbox" checked={checked} onChange={handleChange} />
    </label>
  )
}

export default React.memo(Checkbox) as typeof Checkbox
