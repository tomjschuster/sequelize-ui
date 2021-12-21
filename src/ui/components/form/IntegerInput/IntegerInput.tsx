import { classnames, fontSize, padding, width } from '@src/ui/styles/classnames'
import { Override } from '@src/utils/types'
import React from 'react'
import InputWrapper, { alertId } from '../shared/InputWrapper'
import { FieldProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type IntegerInputProps = FieldProps<
  number | undefined,
  Override<React.InputHTMLAttributes<HTMLInputElement>, { min?: number; max?: number }>
>

function IntegerInput({
  id,
  label,
  value,
  min,
  max,
  error,
  onChange,
  ...rest
}: IntegerInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (!evt.target.value) onChange(undefined, evt)

      const updatedValue = parseInt(evt.target.value)
      if (isNaN(updatedValue)) return
      if (max !== undefined && updatedValue > max) return
      if (min !== undefined && updatedValue < min) return

      onChange(updatedValue, evt)
    },
    [onChange, min, max],
  )

  return (
    <InputWrapper id={id} label={label} error={error}>
      <input
        className={classnames(
          padding('py-1', 'px-2', 'p-0.5'),
          width('w-full'),
          fontSize('text-sm'),
        )}
        id={id}
        type="number"
        min={min}
        max={max}
        value={value === undefined ? '' : value}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={alertId(id)}
        {...autofillDisable}
        {...rest}
      />
    </InputWrapper>
  )
}

export default React.memo(IntegerInput)
