import { classnames, fontSize, padding, width, WithClassname } from '@src/ui/styles/classnames'
import React from 'react'
import Input from '../shared/Input'
import InputWrapper, { alertId } from '../shared/InputWrapper'
import { FieldProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type TextInputProps = WithClassname<
  FieldProps<string | undefined, React.InputHTMLAttributes<HTMLInputElement>>
>

function TextInput({
  id,
  className,
  label,
  error,
  fixedErrorContainer,
  value,
  onChange,
  ...rest
}: TextInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.value || undefined, evt),
    [onChange],
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
        id={id}
        className={classnames(width('w-full'), fontSize('text-sm'), padding('py-1', 'px-2'))}
        type="text"
        value={value || ''}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={alertId(id)}
        {...autofillDisable}
        {...rest}
      />
    </InputWrapper>
  )
}

export default React.memo(TextInput)
