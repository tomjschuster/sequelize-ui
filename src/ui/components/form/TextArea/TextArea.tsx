import { classnames, fontSize, placeholderColor, width } from '@src/ui/styles/classnames'
import { backgroundWhite } from '@src/ui/styles/utils'
import { debounce } from '@src/utils/functions'
import React from 'react'
import InputWrapper, { alertId } from '../shared/InputWrapper'
import { FieldProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type TextAreaProps = FieldProps<
  string | undefined,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>

function TextArea({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  ...rest
}: TextAreaProps): React.ReactElement {
  const [internalValue, setInternalValue] = React.useState(value)
  const lastEvent = React.useRef<React.ChangeEvent<HTMLTextAreaElement>>()

  React.useEffect(() => {
    if (value !== internalValue) setInternalValue(value)
  }, [value])

  const handleChangeDebounced = React.useMemo(
    () =>
      debounce((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(evt.target.value || undefined, evt)
      }, 750),
    [onChange],
  )

  const handleBlur = (evt: React.FocusEvent<HTMLTextAreaElement>) => {
    if (handleChangeDebounced.cancel() && lastEvent.current) {
      onChange(lastEvent.current.target.value || undefined, lastEvent.current)
    }
    lastEvent.current = undefined
    if (onBlur) onBlur(evt)
  }

  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInternalValue(evt.target.value || undefined)
      lastEvent.current = evt
      handleChangeDebounced(evt)
    },
    [onChange],
  )

  return (
    <InputWrapper id={id} label={label} error={error}>
      <textarea
        id={id}
        className={classnames(
          width('w-full'),
          fontSize('text-sm'),
          backgroundWhite,
          placeholderColor('dark:placeholder-gray-400'),
        )}
        value={internalValue || undefined}
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

export default React.memo(TextArea)
