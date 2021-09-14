import React from 'react'
import { CommonFieldProps, CommonInputProps } from '../shared/types'

type IntegerInputProps = CommonInputProps<number> &
  CommonFieldProps & {
    min?: number
    max?: number
  }

function IntegerInput({
  id,
  label,
  value,
  min,
  max,
  error,
  onChange,
}: IntegerInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (!evt.target.value) onChange(undefined)

      const updatedValue = parseInt(evt.target.value)
      if (isNaN(updatedValue)) return
      if (max !== undefined && updatedValue > max) return
      if (min !== undefined && updatedValue < min) return

      onChange(updatedValue)
    },
    [onChange],
  )

  return (
    <>
      <label htmlFor={id} className="flex flex-col items-start">
        {label}
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value === undefined ? '' : value}
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

export default React.memo(IntegerInput)
