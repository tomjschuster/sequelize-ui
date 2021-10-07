import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { lookupOptionKey, lookupOptionValue, optionsToList } from '../shared/options'
import { CommonFieldProps, CommonOptionsProps } from '../shared/types'
type SelectProps<T> = CommonFieldProps & CommonOptionsProps<T> & { className?: string }
function Select<T>({
  id,
  label,
  value,
  options,
  error,
  display,
  onChange,
  className,
}: SelectProps<T>): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const key = evt.target.value
    const option = lookupOptionValue(options, key)
    if (option !== undefined) onChange(option)
  }

  return (
    <div className={`${className} ${classnames('w-full')}`}>
      <label htmlFor={id} className={classnames('w-full', 'flex', 'flex-col', 'items-start')}>
        <span className={classnames('text-sm')}>{label}</span>
        <select
          id={id}
          className={classnames('py-1', 'px-2', 'w-full', 'cursor-pointer')}
          onChange={handleChange}
          value={lookupOptionKey(options, value)}
          aria-invalid={!!error}
          aria-describedby={`${id}-alert`}
        >
          {optionsToList(options).map(([k, v]) => (
            <option key={id + k} value={k}>
              {display(v)}
            </option>
          ))}
        </select>
      </label>
      <span id={`${id}-alert`} role={error ? 'alert' : undefined} aria-hidden={!error}>
        {error}
      </span>
    </div>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Select) as typeof Select
