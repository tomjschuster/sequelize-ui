import { Classname, classnames, fontSize, padding, width } from '@src/ui/styles/classnames'
import { Override } from '@src/utils/types'
import React from 'react'
import InputWrapper, { alertId } from '../shared/InputWrapper'
import { FieldProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type TextInputProps = Override<
  FieldProps<string | undefined, React.InputHTMLAttributes<HTMLInputElement>>,
  { className?: Classname }
>

function TextInput({
  id,
  className,
  label,
  error,
  value,
  onChange,
  ...rest
}: TextInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.value || undefined, evt),
    [onChange],
  )

  return (
    <InputWrapper id={id} className={className} label={label} error={error}>
      <input
        id={id}
        className={classnames(width('w-full'), fontSize('text-sm'), padding('py-1', 'px-2'))}
        type="text"
        value={value}
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
