import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { CommonFieldProps, CommonInputProps } from '../shared/types'

type TextInputProps = CommonFieldProps &
  CommonInputProps<string> & {
    className?: string
    large?: boolean
    placeholder?: string
    onBlur?: () => void
    onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>
  }

function TextInput({
  id,
  label,
  value,
  className,
  large,
  placeholder,
  error,
  onChange,
  onBlur,
  onKeyPress,
}: TextInputProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.value || undefined),
    [onChange],
  )

  return (
    <div className={`${classnames('relative')} ${className}`}>
      <label
        htmlFor={id}
        className={classnames('w-full', 'flex', 'flex-col', 'items-start', {
          'pb-6': !error && !large,
          'h-full': large,
        })}
      >
        <span
          className={classnames({
            'text-sm': !large,
            'text-xs': large,
            absolute: large,
            'top-0.5': large,
            'left-3.5': large,
          })}
        >
          {label}
        </span>
        <input
          className={classnames('w-full', 'text-sm', {
            'border-none': large,
            'h-full': large,
            'text-base': large,
            'py-5': large,
            'px-3.5': large,
            'py-1': !large,
            'px-2': !large,
          })}
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          aria-invalid={!!error}
          aria-describedby={`${id}-alert`}
          autoComplete="off"
          data-lpignore="true"
          data-form-type="other"
        />
      </label>
      <span
        id={`${id}-alert`}
        className={classnames('text-red-700', 'text-xs', {
          absolute: large,
          'bottom-0.5': large,
          'left-3.5': large,
        })}
        role={error ? 'alert' : undefined}
        aria-hidden={!error}
      >
        {error}
      </span>
    </div>
  )
}

export default React.memo(TextInput)
