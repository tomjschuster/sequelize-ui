import {
  alignItems,
  Classname,
  classnames,
  display,
  flexDirection,
  fontSize,
  padding,
  width,
} from '@src/ui/styles/classnames'
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
    <div className={classnames(width('w-full'), className)}>
      <label
        htmlFor={id}
        className={classnames(
          display('flex'),
          flexDirection('flex-col'),
          alignItems('items-start'),
          padding({ 'pb-6': !error }),
        )}
      >
        <span className={classnames(fontSize('text-sm'))}>{label}</span>
        {children}
      </label>
      <FormError id={alertId(id)} error={error} />
    </div>
  )
}
