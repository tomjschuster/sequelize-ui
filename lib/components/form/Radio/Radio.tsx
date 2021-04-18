import React from 'react'
import { lookupOptionValue, optionsToList } from '../shared/options'
import { CommonInputProps, CommonOptionsProps } from '../shared/types'

type RadioProps<T> = CommonInputProps<T> & CommonOptionsProps<T>

function Radio<T>({ value, options, display, onChange }: RadioProps<T>): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const key = evt.target.value
    const option = lookupOptionValue(options, key)
    if (option !== undefined) onChange(option)
  }

  return (
    <div>
      {optionsToList(options).map(([k, v]) => (
        <label key={k}>
          <input type="radio" value={k} checked={v === value} onChange={handleChange} />
          {display(v)}
        </label>
      ))}
    </div>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Radio) as typeof Radio
