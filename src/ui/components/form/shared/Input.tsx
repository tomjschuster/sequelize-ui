import { classnames, placeholderColor, WithClassname } from '@src/ui/styles/classnames'
import { backgroundWhite } from '@src/ui/styles/utils'
import React from 'react'

type TextInputProps = WithClassname<React.InputHTMLAttributes<HTMLInputElement>>

function Input({ className, ...props }: TextInputProps): React.ReactElement {
  return (
    <input
      className={classnames(
        className,
        backgroundWhite,
        placeholderColor('dark:placeholder-gray-400'),
      )}
      {...props}
    />
  )
}

export default React.memo(Input)
