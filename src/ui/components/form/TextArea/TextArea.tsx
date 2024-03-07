import { WithClassname, classnames, fontSize, width } from '@src/ui/styles/classnames'
import { backgroundWhite } from '@src/ui/styles/utils'
import React from 'react'
import InputWrapper, { alertId } from '../shared/InputWrapper'
import { FieldProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type TextAreaProps = WithClassname<
  FieldProps<string | undefined, React.TextareaHTMLAttributes<HTMLTextAreaElement>>
>

function TextArea({
  id,
  label,
  value,
  error,
  fixedErrorContainer,
  className,
  onChange,
  ...rest
}: TextAreaProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => onChange(evt.target.value || undefined, evt),
    [onChange],
  )

  return (
    <InputWrapper
      id={id}
      label={label}
      error={error}
      fixedErrorContainer={fixedErrorContainer}
      className={className}
    >
      <textarea
        id={id}
        className={classnames(width('w-full'), fontSize('text-sm'), backgroundWhite)}
        value={value || undefined}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={alertId(id)}
        {...autofillDisable}
        {...rest}
      />
    </InputWrapper>
  )
}

export default React.memo(TextArea)
