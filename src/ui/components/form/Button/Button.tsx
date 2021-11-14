import { classnames } from '@src/ui/styles/classnames'
import { TArg } from '@src/ui/styles/classnames/__generated__/tailwindcss-classnames'
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function Button({ className, ...props }: ButtonProps): React.ReactElement {
  return (
    <button
      className={classnames(
        'flex',
        'items-center',
        'justify-center',
        'text-sm',
        'p-1',
        'border',
        'border-gray-400',
        'rounded',
        'focus:outline-none',
        'focus-visible:border-blue-500',
        'focus-visible:font-bold',
        className as TArg,
      )}
      {...props}
    />
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Button) as typeof Button
