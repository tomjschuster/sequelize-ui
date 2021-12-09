import { Classname, classnames } from '@src/ui/styles/classnames'
import React from 'react'
import FormError from './FormError'
import { FieldWrapperProps } from './types'

export type InputWrapperProps = React.PropsWithChildren<
  FieldWrapperProps & { className?: Classname }
>

export function alertId(id: string): string {
  return `${id}-alert`
}

export default function InputWrapper({
  id,
  className,
  label,
  error,
  children,
}: InputWrapperProps): React.ReactElement {
  return (
    <div className={classnames('w-full', className)}>
      <label
        htmlFor={id}
        className={classnames('flex', 'flex-col', 'items-start', { 'pb-6': !error })}
      >
        <span className={classnames('text-sm')}>{label}</span>
        {children}
      </label>
      <FormError id={alertId(id)} error={error} />
    </div>
  )
}
