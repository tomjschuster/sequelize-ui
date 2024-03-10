import { classnames, fontSize, padding, width, WithClassname } from '@src/ui/styles/classnames'
import { Override } from '@src/utils/types'
import React from 'react'
import Input from '../shared/Input'
import InputWrapper, { alertId } from '../shared/InputWrapper'
import { FieldProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type NumberInputProps = WithClassname<
  FieldProps<
    number | undefined,
    Override<
      React.InputHTMLAttributes<HTMLInputElement>,
      { min?: number; max?: number; allowDecimals?: boolean }
    >
  >
>

function NumberInput({
  id,
  className,
  label,
  value,
  min,
  max,
  allowDecimals,
  error,
  fixedErrorContainer,
  onChange,
  ...rest
}: NumberInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value

      if (!value) onChange(undefined, evt)

      const updatedValue = allowDecimals ? parseFloat(value) : parseInt(value)
      if (isNaN(updatedValue)) return
      if (max !== undefined && updatedValue > max) return
      if (min !== undefined && updatedValue < min) return

      onChange(updatedValue, evt)
    },
    [onChange, allowDecimals, min, max],
  )

  return (
    <InputWrapper
      id={id}
      className={className}
      label={label}
      error={error}
      fixedErrorContainer={fixedErrorContainer}
    >
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
        step={allowDecimals ? 'any' : undefined}
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

export default React.memo(NumberInput)
