import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { lookupOptionValue, optionsToList } from '../shared/options'
import { CommonOptionsProps } from '../shared/types'

type ToggleProps<T> = CommonOptionsProps<T> & { disabled?: (v: T) => boolean }

function Toggle<T>({
  value,
  options,
  display,
  disabled,
  onChange,
}: ToggleProps<T>): React.ReactElement {
  const handleChange = (key: string) => () => {
    const option = lookupOptionValue(options, key)
    if (option !== undefined) onChange(option)
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
              'focus-visible:border-blue-500',
              'focus-visible:font-bold',
              {
                'text-blue-900': selected,
                'bg-blue-50': selected,
              },
            )}
            type="button"
            aria-pressed={selected ? 'true' : 'false'}
            disabled={!!disabled && disabled(v)}
            value={k}
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
export default React.memo(Toggle) as typeof Toggle
