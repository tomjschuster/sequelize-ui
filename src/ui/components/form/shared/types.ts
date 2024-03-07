import { Override } from '@src/utils/types'
import React from 'react'
import { Options } from './options'

export type FieldProps<T, P> =
  P extends React.HTMLAttributes<infer E>
    ? E extends HTMLElement
      ? Override<P, FieldWrapperProps & CommonFieldProps<E, T>>
      : never
    : never

export type CommonFieldProps<E extends HTMLElement, T> = {
  value: T | null
  onChange: (value: T, evt: React.ChangeEvent<E>) => void
}

export type FieldWrapperProps = {
  id: string
  label: string
  error?: string
  fixedErrorContainer?: boolean
}

export type OptionsProps<T, P> = Override<
  FieldProps<T, P>,
  Override<CommonOptionsProps<T>, { id?: string; label?: string }>
>

export type CommonOptionsProps<T> = {
  options: Options<T>
  display?: (value: T) => React.ReactNode | string
  disabled?: (value: T) => boolean
}
