import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { lookupOptionValue, optionsToList } from '../shared/options'
import { CommonOptionsProps } from '../shared/types'

type ToggleButtonProps<T> = CommonOptionsProps<T> & {
  value: T
  onChange: (value: T, evt: React.MouseEvent<HTMLButtonElement>) => void
}

function ToggleButton<T>({
  value,
  options,
  display,
  disabled = () => false,
  onChange,
}: ToggleButtonProps<T>): React.ReactElement {
  const handleChange = (key: string) => (evt: React.MouseEvent<HTMLButtonElement>) => {
    const option = lookupOptionValue(options, key)
    if (option !== undefined) onChange(option, evt)
  }

  return (
    <div className={classnames('flex', 'w-full')} role="group">
      {optionsToList(options).map(([k, v]) => {
        const selected = v === value

        return (
          <button
            key={k}
            className={classnames(
              'flex',
              'items-center',
              'text-xs',
              'p-1',
              'border',
              'border-gray-400',
              'border-l-0',
              'first:border-l',
              'first:rounded-l',
              'last:rounded-r',
              'focus:outline-none',
              'focus-visible:outline-black',
              {
                'text-blue-900': selected,
                'bg-blue-50': selected,
                'font-semibold': selected,
              },
            )}
            type="button"
            aria-pressed={selected ? 'true' : 'false'}
            value={k}
            disabled={disabled(v)}
            onClick={handleChange(k)}
          >
            {display(v)}
          </button>
        )
      })}
    </div>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(ToggleButton) as typeof ToggleButton
