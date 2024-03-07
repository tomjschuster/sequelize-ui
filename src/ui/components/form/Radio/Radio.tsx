import {
  backgroundColor,
  Classname,
  classnames,
  display,
  fontSize,
  margin,
  padding,
  width,
} from '@src/ui/styles/classnames'
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
  display: displayValue,
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
    <div className={classnames(className, display('flex'), width('w-full'))}>
      {optionsToList(options).map(([k, v]) => (
        <label key={k} className={classnames(margin('mr-2', 'last:mr-0'))}>
          <input
            className={classnames(backgroundColor('dark:bg-gray-900'))}
            type="radio"
            value={k}
            checked={v === value}
            disabled={disabled(v)}
            onChange={handleChange}
            {...autofillDisable}
            {...rest}
          />
          <span className={classnames(padding('pl-2'), fontSize('text-sm'))}>
            {displayValue ? displayValue(v) : k}
          </span>
        </label>
      ))}
    </div>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Radio) as typeof Radio
