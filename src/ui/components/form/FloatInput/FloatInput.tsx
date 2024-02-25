import { classnames, fontSize, padding, width, WithClassname } from '@src/ui/styles/classnames'
import { Override } from '@src/utils/types'
import React from 'react'
import Input from '../shared/Input'
import InputWrapper, { alertId } from '../shared/InputWrapper'
import { FieldProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type FloatInputProps = WithClassname<
  FieldProps<
    number | undefined,
    Override<React.InputHTMLAttributes<HTMLInputElement>, { min?: number; max?: number }>
  >
>

function FloatInput({
  id,
  className,
  label,
  value,
  min,
  max,
  error,
  noError,
  onChange,
  ...rest
}: FloatInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (!evt.target.value) onChange(undefined, evt)

      const updatedValue = parseFloat(evt.target.value)
      if (isNaN(updatedValue)) return
      if (max !== undefined && updatedValue > max) return
      if (min !== undefined && updatedValue < min) return

      onChange(updatedValue, evt)
    },
    [onChange, min, max],
  )

  return (
    <InputWrapper id={id} className={className} label={label} error={error} noError={noError}>
      <Input
        className={classnames(
          padding('py-1', 'px-2', 'p-0.5'),
          width('w-full'),
          fontSize('text-sm'),
        )}
        id={id}
        type="number"
        min={min}
        max={max}
        step="any"
        value={value === null ? '' : value}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={alertId(id)}
        {...autofillDisable}
        {...rest}
      />
    </InputWrapper>
  )
}

export default React.memo(FloatInput)
