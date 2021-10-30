import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { lookupOptionValue, optionsToList } from '../shared/options'
import { CommonOptionsProps } from '../shared/types'

type RadioProps<T> = CommonOptionsProps<T>

function Radio<T>({ value, options, display, onChange }: RadioProps<T>): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const key = evt.target.value
    const option = lookupOptionValue(options, key)
    if (option !== undefined) onChange(option)
  }

  return (
    <div className={classnames('flex', 'w-full')}>
      {optionsToList(options).map(([k, v]) => (
        <label key={k} className={classnames('mr-2', 'last:mr-0')}>
          <input type="radio" value={k} checked={v === value} onChange={handleChange} />
          <span className={classnames('pl-2', 'text-sm')}>{display(v)}</span>
        </label>
      ))}
    </div>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Radio) as typeof Radio
