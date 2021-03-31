import { keyFromEnum } from '@lib/utils'
import React from 'react'

type EnumSelectProps<T> = {
  id: string
  label: string
  value: T
  enumConst: { [key: string]: T }
  display: (value: T) => string
  onChange: (value: T) => void
}

export default function EnumSelect<T>({
  id,
  label,
  value,
  enumConst,
  display,
  onChange,
}: EnumSelectProps<T>): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const key = evt.target.value
    if (key in enumConst) onChange(enumConst[key])
  }

  return (
    <label htmlFor={id}>
      {label}
      <select id={id} onChange={handleChange} value={keyFromEnum(enumConst, value)}>
        {Object.entries(enumConst).map(([enumKey, enumValue]) => (
          <option key={id + enumKey} value={enumKey}>
            {display(enumValue)}
          </option>
        ))}
      </select>
    </label>
  )
}
