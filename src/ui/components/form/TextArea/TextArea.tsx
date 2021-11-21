import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { CommonFieldProps, CommonInputProps } from '../shared/types'

type TextAreaProps = CommonFieldProps &
  CommonInputProps<string> & {
    large?: boolean
    placeholder?: string
    rows?: number
    onBlur?: () => void
  }

function TextArea({
  id,
  label,
  value,
  large,
  placeholder,
  rows,
  error,
  onChange,
  onBlur,
}: TextAreaProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => onChange(evt.target.value || undefined),
    [onChange],
  )

  return (
    <>
      <label
        htmlFor={id}
        className={classnames('w-full', 'flex', 'flex-col', 'items-start', { 'pb-6': !error })}
      >
        <span className={classnames('text-sm')}>{label}</span>
        <textarea
          className={classnames('w-full', 'text-sm', {
            'border-none': large,
            'h-full': large,
            'text-lg': large,
            'py-2': large,
            'px-4': large,
            'py-1': !large,
            'px-2': !large,
          })}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={`${id}-alert`}
          autoComplete="off"
          data-lpignore="true"
          data-form-text="other"
        />
      </label>
      <span
        id={`${id}-alert`}
        className={classnames('text-red-700', 'text-xs')}
        role={error ? 'alert' : undefined}
        aria-hidden={!error}
      >
        {error}
      </span>
    </>
  )
}

export default React.memo(TextArea)
