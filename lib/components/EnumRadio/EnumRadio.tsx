import React from 'react'

type EnumRadioProps<T> = {
  value: T
  enumConst: { [key: string]: T }
  display: (value: T) => string
  onChange: (value: T) => void
}

export default function EnumRadio<T>({
  value,
  enumConst,
  display,
  onChange,
}: EnumRadioProps<T>): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const key = evt.target.value
    if (key in enumConst) onChange(enumConst[key])
  }

  return (
    <div>
      {Object.entries(enumConst).map(([enumKey, enumValue]) => (
        <label key={enumKey}>
          <input
            type="radio"
            value={enumKey}
            checked={enumValue == value}
            onChange={handleChange}
          />
          {display(enumValue)}
        </label>
      ))}
    </div>
  )
}
