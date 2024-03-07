import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  display,
  fontSize,
  fontWeight,
  outlineColor,
  outlineStyle,
  padding,
  textColor,
  width,
  WithClassname,
} from '@src/ui/styles/classnames'
import React from 'react'
import { lookupOptionValue, optionsToList } from '../shared/options'
import { CommonOptionsProps } from '../shared/types'

type ToggleButtonProps<T> = CommonOptionsProps<T> &
  WithClassname<{
    value: T
    onChange: (value: T, evt: React.MouseEvent<HTMLButtonElement>) => void
  }>

function ToggleButton<T>({
  value,
  options,
  display: displayValue,
  disabled = () => false,
  onChange,
  className,
}: ToggleButtonProps<T>): React.ReactElement {
  const handleChange = (key: string) => (evt: React.MouseEvent<HTMLButtonElement>) => {
    const option = lookupOptionValue(options, key)
    if (option !== undefined) onChange(option, evt)
  }

  return (
    <div className={classnames(display('flex'), width('w-full'))} role="group">
      {optionsToList(options).map(([k, v]) => {
        const selected = v === value

        return (
          <button
            key={k}
            className={classnames(
              className,
              display('flex'),
              alignItems('items-center'),
              fontSize('text-xs'),
              padding('p-1'),
              borderWidth('border', 'border-l-0', 'first:border-l'),
              borderColor('border-gray-400'),
              borderRadius('first:rounded-l', 'last:rounded-r'),
              outlineStyle('focus:outline-none'),
              outlineColor('focus-visible:outline-black'),
              textColor({ 'text-blue-900': selected, 'dark:text-blue-50': selected }),
              backgroundColor({ 'bg-blue-50': selected, 'dark:bg-blue-900': selected }),
              fontWeight({ 'font-semibold': selected }),
            )}
            type="button"
            aria-pressed={selected ? 'true' : 'false'}
            value={k}
            disabled={disabled(v)}
            onClick={handleChange(k)}
          >
            {displayValue ? displayValue(v) : k}
          </button>
        )
      })}
    </div>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(ToggleButton) as typeof ToggleButton
