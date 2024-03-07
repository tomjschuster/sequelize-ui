import { Classname, classnames, cursor, fontSize, padding, width } from '@src/ui/styles/classnames'
import { backgroundWhite } from '@src/ui/styles/utils'
import { Override } from '@src/utils/types'
import React from 'react'
import InputWrapper from '../shared/InputWrapper'
import { lookupOptionKey, lookupOptionValue, optionsToList } from '../shared/options'
import { OptionsProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type SelectProps<T> = Override<
  OptionsProps<T, React.SelectHTMLAttributes<HTMLSelectElement>>,
  { className?: Classname }
>

function Select<T>({
  id,
  className,
  label,
  value,
  options,
  error,
  fixedErrorContainer,
  display,
  onChange,
  disabled = () => false,
  ...rest
}: SelectProps<T>): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const key = evt.target.value
    const option = lookupOptionValue(options, key)
    if (option !== undefined) onChange(option, evt)
  }

  const select = (
    <select
      id={id}
      className={classnames(
        backgroundWhite,
        padding('p-1', 'px-2'),
        width('w-full'),
        cursor('cursor-pointer'),
        fontSize('text-sm'),
      )}
      onChange={handleChange}
      value={lookupOptionKey(options, value)}
      aria-invalid={!!error}
      aria-describedby={`${id}-alert`}
      {...autofillDisable}
      {...rest}
    >
      {optionsToList(options).map(([k, v]) => (
        <option key={id + k} value={k} disabled={disabled(v)}>
          {display ? display(v) : k}
        </option>
      ))}
    </select>
  )

  return id && label ? (
    <InputWrapper
      id={id}
      label={label}
      error={error}
      fixedErrorContainer={fixedErrorContainer}
      className={className}
    >
      {select}
    </InputWrapper>
  ) : (
    select
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Select) as typeof Select
