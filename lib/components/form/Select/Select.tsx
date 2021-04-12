import React from 'react'
import { classnames } from 'tailwindcss-classnames'
import { lookupOptionKey, lookupOptionValue, Options, optionsToList } from '../shared/options'

type SelectProps<T> = {
  id: string
  label: string
  value: T | undefined
  options: Options<T>
  display: (value: T) => string
  onChange: (value: T) => void
}

function Select<T>({
  id,
  label,
  value,
  options,
  display,
  onChange,
}: SelectProps<T>): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const key = evt.target.value
    const option = lookupOptionValue(options, key)
    if (option) onChange(option)
  }

  return (
    <label htmlFor={id} className={classnames('flex flex-col items-start')}>
      {label}
      <select id={id} onChange={handleChange} value={lookupOptionKey(options, value)}>
        {optionsToList(options).map(([k, v]) => (
          <option key={id + k} value={k}>
            {display(v)}
          </option>
        ))}
      </select>
    </label>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Select) as typeof Select
