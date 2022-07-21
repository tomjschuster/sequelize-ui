import { classnames, fontSize, padding, width, WithClassname } from '@src/ui/styles/classnames'
import { debounce } from '@src/utils/functions'
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
  value,
  onChange,
  onBlur,
  ...rest
}: TextInputProps): React.ReactElement {
  const [internalValue, setInternalValue] = React.useState(value)
  const lastEvent = React.useRef<React.ChangeEvent<HTMLInputElement>>()

  const handleChangeDebounced = React.useMemo(
    () =>
      debounce((evt: React.ChangeEvent<HTMLInputElement>) => {
        onChange(evt.target.value || undefined, evt)
      }, 750),
    [onChange],
  )

  React.useEffect(() => {
    if (value !== internalValue) setInternalValue(value)
  }, [value])

  const handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    if (handleChangeDebounced.cancel() && lastEvent.current) {
      onChange(lastEvent.current.target.value || undefined, lastEvent.current)
    }
    lastEvent.current = undefined
    if (onBlur) onBlur(evt)
  }

  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(evt.target.value || undefined)
      lastEvent.current = evt
      handleChangeDebounced(evt)
    },
    [handleChangeDebounced],
  )

  return (
    <InputWrapper id={id} className={className} label={label} error={error}>
      <Input
        id={id}
        className={classnames(width('w-full'), fontSize('text-sm'), padding('py-1', 'px-2'))}
        type="text"
        value={internalValue || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={alertId(id)}
        {...autofillDisable}
        {...rest}
      />
    </InputWrapper>
  )
}

export default React.memo(TextInput)
