import { Classname, classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { lookupOptionValue, optionsToList } from '../shared/options'
import { OptionsProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type RadioProps<T> = OptionsProps<
  T,
  React.InputHTMLAttributes<HTMLInputElement> & { className?: Classname }
>

function Radio<T>({
  className,
  value,
  options,
  display,
  onChange,
  disabled = () => false,
  ...rest
}: RadioProps<T>): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const key = evt.target.value
    const option = lookupOptionValue(options, key)
    if (option !== undefined) onChange(option, evt)
  }

  return (
    <div className={classnames(className, 'flex', 'w-full')}>
      {optionsToList(options).map(([k, v]) => (
        <label key={k} className={classnames('mr-2', 'last:mr-0')}>
          <input
            type="radio"
            value={k}
            checked={v === value}
            disabled={disabled(v)}
            onChange={handleChange}
            {...autofillDisable}
            {...rest}
          />
          <span className={classnames('pl-2', 'text-sm')}>{display(v)}</span>
        </label>
      ))}
    </div>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Radio) as typeof Radio
